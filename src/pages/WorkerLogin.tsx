import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge, Loader2, User, Phone, Lock, MessageSquare } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import WorkerAuthService from '@/services/workerAuthService';
import { WorkerLoginForm, WorkerOTPForm } from '@/types';

const WorkerLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  // Employee ID login form
  const [employeeForm, setEmployeeForm] = useState<WorkerLoginForm>({
    employee_id: '',
    password: ''
  });

  // Phone OTP login form
  const [otpForm, setOtpForm] = useState<WorkerOTPForm>({
    phone_number: '',
    otp: ''
  });

  // Handle Employee ID login
  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeForm.employee_id || !employeeForm.password) {
      toast({
        title: "Missing Information",
        description: "Please enter both Employee ID and Password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await WorkerAuthService.loginWithEmployeeId(employeeForm);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.worker.full_name}!`,
      });

      // Navigate to worker dashboard
      navigate('/worker/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP request
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpForm.phone_number) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your registered phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await WorkerAuthService.sendOTP(otpForm.phone_number);
      setOtpSent(true);
      
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      toast({
        title: "Failed to Send OTP",
        description: error.message || "Please check your phone number and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpForm.otp) {
      toast({
        title: "OTP Required",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await WorkerAuthService.verifyOTPAndLogin(otpForm);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.worker.full_name}!`,
      });

      // Navigate to worker dashboard
      navigate('/worker/dashboard');
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Login</h1>
          <p className="text-gray-600">Access your assigned tasks and manage field work</p>
          <Badge variant="outline" className="mt-2">
            Nagar Setu Field Worker Portal
          </Badge>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Choose Login Method</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="employee" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="employee" className="flex items-center gap-2">
                  <Badge className="h-4 w-4" />
                  Employee ID
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone OTP
                </TabsTrigger>
              </TabsList>

              {/* Employee ID Login */}
              <TabsContent value="employee">
                <form onSubmit={handleEmployeeLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employee ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Enter your Employee ID"
                        value={employeeForm.employee_id}
                        onChange={(e) => setEmployeeForm(prev => ({ ...prev, employee_id: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={employeeForm.password}
                        onChange={(e) => setEmployeeForm(prev => ({ ...prev, password: e.target.value }))}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Phone OTP Login */}
              <TabsContent value="phone">
                {!otpSent ? (
                  <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="Enter your registered phone number"
                          value={otpForm.phone_number}
                          onChange={(e) => setOtpForm(prev => ({ ...prev, phone_number: e.target.value }))}
                          className="pl-10"
                          disabled={isLoading}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the phone number registered with your worker account
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP} className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                        <MessageSquare className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-sm text-gray-600">
                        OTP sent to {otpForm.phone_number}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Code
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otpForm.otp}
                        onChange={(e) => setOtpForm(prev => ({ ...prev, otp: e.target.value }))}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        'Verify & Sign In'
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOtpSent(false);
                        setOtpForm(prev => ({ ...prev, otp: '' }));
                      }}
                      disabled={isLoading}
                    >
                      Back to Phone Number
                    </Button>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? Contact your supervisor or IT support
          </p>
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Main Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;