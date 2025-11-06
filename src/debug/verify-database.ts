/**
 * Database Verification Script
 * Run this to verify the user_profiles table structure and data
 */

import { supabase } from '@/lib/supabase';

export async function verifyDatabaseStructure() {
  console.log('🔍 Verifying Database Structure...');
  console.log('=====================================\n');

  try {
    // 1. Check if user_profiles table exists and get its structure
    console.log('1. Checking user_profiles table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(0);

    if (tableError) {
      console.error('❌ Error accessing user_profiles table:', tableError);
      
      // Try alternative table name
      console.log('Trying alternative table name: users...');
      const { data: usersTableInfo, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(0);
        
      if (usersError) {
        console.error('❌ Error accessing users table:', usersError);
      } else {
        console.log('✅ Found users table instead of user_profiles');
      }
      return;
    }

    console.log('✅ user_profiles table accessible');

    // 2. Check for recent user profiles
    console.log('\n2. Checking recent user profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    console.log(`Found ${profiles?.length || 0} recent profiles:`);
    profiles?.forEach((profile, index) => {
      console.log(`\nProfile ${index + 1}:`);
      console.log(`  ID: ${profile.id}`);
      console.log(`  Email: ${profile.email}`);
      console.log(`  Name: ${profile.full_name}`);
      console.log(`  User Type: ${profile.user_type || 'NOT SET'}`);
      console.log(`  Department: ${profile.department || 'NOT SET'}`);
      console.log(`  Onboarding Complete: ${profile.is_onboarding_complete}`);
      console.log(`  Created: ${profile.created_at}`);
    });

    // 3. Check for worker profiles specifically
    console.log('\n3. Checking for worker profiles...');
    const { data: workers, error: workersError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_type', 'worker');

    if (workersError) {
      console.error('❌ Error fetching worker profiles:', workersError);
    } else {
      console.log(`✅ Found ${workers?.length || 0} worker profiles`);
      workers?.forEach((worker, index) => {
        console.log(`\nWorker ${index + 1}:`);
        console.log(`  Name: ${worker.full_name}`);
        console.log(`  Department: ${worker.department}`);
        console.log(`  Onboarding: ${worker.is_onboarding_complete ? 'Complete' : 'Incomplete'}`);
      });
    }

    // 4. Check table schema
    console.log('\n4. Checking table schema...');
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_table_schema', { table_name: 'user_profiles' })
      .single();

    if (schemaError) {
      console.log('⚠️  Could not fetch schema details (this is normal)');
    } else {
      console.log('✅ Schema information available');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error);
  }

  console.log('\n🎯 Verification Complete!');
  console.log('=====================================');
}

// Test user profile creation
export async function testUserProfileCreation() {
  console.log('\n🧪 Testing User Profile Creation...');
  console.log('=====================================\n');

  const testProfile = {
    id: 'test-user-id-' + Date.now(),
    email: 'test-worker@example.com',
    full_name: 'Test Worker',
    user_type: 'worker',
    department: 'Infrastructure',
    is_onboarding_complete: true
  };

  try {
    console.log('Creating test profile:', testProfile);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([testProfile])
      .select()
      .single();

    if (error) {
      console.error('❌ Failed to create test profile:', error);
      return;
    }

    console.log('✅ Test profile created successfully:', data);

    // Clean up
    console.log('Cleaning up test profile...');
    const { error: deleteError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', testProfile.id);

    if (deleteError) {
      console.error('⚠️  Failed to clean up test profile:', deleteError);
    } else {
      console.log('✅ Test profile cleaned up');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run verification if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  (window as any).verifyDatabase = verifyDatabaseStructure;
  (window as any).testUserProfile = testUserProfileCreation;
  console.log('Database verification functions available:');
  console.log('- verifyDatabase()');
  console.log('- testUserProfile()');
}