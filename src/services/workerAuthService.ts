import { supabase } from '@/lib/supabase';
import { Worker, WorkerLoginForm, WorkerOTPForm } from '@/types';

export class WorkerAuthService {
  // Login with Employee ID and Password
  static async loginWithEmployeeId(credentials: WorkerLoginForm) {
    try {
      // First, find the worker by employee_id
      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('employee_id', credentials.employee_id)
        .eq('is_active', true)
        .single();

      if (workerError || !worker) {
        throw new Error('Invalid employee ID or worker not found');
      }

      // Get the associated user account
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', worker.user_id)
        .single();

      if (userError || !user) {
        throw new Error('Worker account not properly configured');
      }

      // Sign in with the user's email and provided password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: credentials.password,
      });

      if (authError) {
        throw new Error('Invalid credentials');
      }

      return {
        user: authData.user,
        session: authData.session,
        worker: worker,
        profile: user
      };
    } catch (error) {
      console.error('Worker login error:', error);
      throw error;
    }
  }

  // Send OTP to phone number
  static async sendOTP(phoneNumber: string) {
    try {
      // First check if worker exists with this phone number
      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('phone_number', phoneNumber)
        .eq('is_active', true)
        .single();

      if (workerError || !worker) {
        throw new Error('No active worker found with this phone number');
      }

      // In a real implementation, you would integrate with an SMS service
      // For now, we'll simulate OTP generation
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store OTP in a temporary table or cache (for demo purposes, we'll use localStorage)
      localStorage.setItem(`worker_otp_${phoneNumber}`, otp);
      localStorage.setItem(`worker_otp_${phoneNumber}_expires`, (Date.now() + 5 * 60 * 1000).toString());

      console.log(`OTP for ${phoneNumber}: ${otp}`); // For development only

      return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  // Verify OTP and login
  static async verifyOTPAndLogin(credentials: WorkerOTPForm) {
    try {
      if (!credentials.otp) {
        throw new Error('OTP is required');
      }

      // Check stored OTP
      const storedOTP = localStorage.getItem(`worker_otp_${credentials.phone_number}`);
      const expiresAt = localStorage.getItem(`worker_otp_${credentials.phone_number}_expires`);

      if (!storedOTP || !expiresAt || Date.now() > parseInt(expiresAt)) {
        throw new Error('OTP expired or not found');
      }

      if (storedOTP !== credentials.otp) {
        throw new Error('Invalid OTP');
      }

      // Find worker by phone number
      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('phone_number', credentials.phone_number)
        .eq('is_active', true)
        .single();

      if (workerError || !worker) {
        throw new Error('Worker not found');
      }

      // Get the associated user account
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', worker.user_id)
        .single();

      if (userError || !user) {
        throw new Error('Worker account not properly configured');
      }

      // Create a session for the worker (in a real app, you'd use proper auth tokens)
      // For now, we'll use a temporary approach
      const sessionToken = `worker_${worker.id}_${Date.now()}`;
      localStorage.setItem('worker_session', sessionToken);
      localStorage.setItem('worker_data', JSON.stringify({ worker, user }));

      // Clean up OTP
      localStorage.removeItem(`worker_otp_${credentials.phone_number}`);
      localStorage.removeItem(`worker_otp_${credentials.phone_number}_expires`);

      return {
        worker: worker,
        profile: user,
        sessionToken: sessionToken
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  }

  // Get current worker session
  static getCurrentWorkerSession() {
    try {
      const sessionToken = localStorage.getItem('worker_session');
      const workerData = localStorage.getItem('worker_data');

      if (!sessionToken || !workerData) {
        return null;
      }

      return JSON.parse(workerData);
    } catch (error) {
      console.error('Get worker session error:', error);
      return null;
    }
  }

  // Logout worker
  static async logoutWorker() {
    try {
      localStorage.removeItem('worker_session');
      localStorage.removeItem('worker_data');
      
      // Also clear any OTP data
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('worker_otp_')) {
          localStorage.removeItem(key);
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Worker logout error:', error);
      throw error;
    }
  }

  // Create a new worker account (for admin use)
  static async createWorker(workerData: {
    employee_id: string;
    full_name: string;
    phone_number: string;
    department: string;
    email: string;
    password: string;
  }) {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: workerData.email,
        password: workerData.password,
      });

      if (authError || !authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: workerData.email,
          full_name: workerData.full_name,
          user_type: 'worker',
          department: workerData.department,
          employee_id: workerData.employee_id,
          phone_number: workerData.phone_number,
          is_onboarding_complete: true
        });

      if (profileError) {
        throw new Error('Failed to create user profile');
      }

      // Create worker record
      const { data: worker, error: workerError } = await supabase
        .from('workers')
        .insert({
          employee_id: workerData.employee_id,
          full_name: workerData.full_name,
          phone_number: workerData.phone_number,
          department: workerData.department,
          user_id: authData.user.id,
          is_active: true
        })
        .select()
        .single();

      if (workerError) {
        throw new Error('Failed to create worker record');
      }

      return { worker, user: authData.user };
    } catch (error) {
      console.error('Create worker error:', error);
      throw error;
    }
  }
}

export default WorkerAuthService;