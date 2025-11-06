/**
 * Fix User Profiles - Add missing user_type field
 * Run this from browser console to fix existing profiles
 */

import { supabase } from '@/lib/supabase';

export async function fixUserProfiles() {
  console.log('🔧 Fixing User Profiles...');
  console.log('==========================\n');

  try {
    // 1. Get all profiles without user_type
    console.log('1. Finding profiles without user_type...');
    const { data: profiles, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .is('user_type', null);

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError);
      return;
    }

    console.log(`Found ${profiles?.length || 0} profiles without user_type`);

    if (!profiles || profiles.length === 0) {
      console.log('✅ All profiles already have user_type set');
      return;
    }

    // 2. Fix each profile
    for (const profile of profiles) {
      console.log(`\nFixing profile: ${profile.full_name} (${profile.email})`);
      
      let inferredUserType = 'citizen'; // default
      
      // If they have a department, they're likely a worker or authority
      if (profile.department) {
        // For now, assume they're workers since that's what we're testing
        inferredUserType = 'worker';
        console.log(`  → Has department (${profile.department}), setting as worker`);
      } else {
        console.log('  → No department, setting as citizen');
      }

      // Update the profile
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          user_type: inferredUserType,
          is_onboarding_complete: inferredUserType === 'worker' ? true : profile.is_onboarding_complete
        })
        .eq('id', profile.id);

      if (updateError) {
        console.error(`  ❌ Failed to update profile:`, updateError);
      } else {
        console.log(`  ✅ Updated to user_type: ${inferredUserType}`);
      }
    }

    console.log('\n🎉 Profile fixing complete!');
    console.log('Please refresh the page to see the changes.');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

export async function checkUserProfileStructure() {
  console.log('🔍 Checking User Profile Structure...');
  console.log('====================================\n');

  try {
    // Get a sample profile to check structure
    const { data: sampleProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('❌ Error fetching sample profile:', error);
      return;
    }

    if (sampleProfile) {
      console.log('📋 Available fields in user_profiles table:');
      Object.keys(sampleProfile).forEach(field => {
        console.log(`  - ${field}: ${typeof sampleProfile[field]} = ${sampleProfile[field]}`);
      });

      console.log('\n🔍 Checking for required fields:');
      console.log(`  ✅ user_type: ${sampleProfile.user_type !== undefined ? 'EXISTS' : '❌ MISSING'}`);
      console.log(`  ✅ department: ${sampleProfile.department !== undefined ? 'EXISTS' : '❌ MISSING'}`);
      console.log(`  ✅ is_onboarding_complete: ${sampleProfile.is_onboarding_complete !== undefined ? 'EXISTS' : '❌ MISSING'}`);
    }

  } catch (error) {
    console.error('❌ Structure check failed:', error);
  }
}

// Make functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).fixUserProfiles = fixUserProfiles;
  (window as any).checkUserProfileStructure = checkUserProfileStructure;
  
  console.log('🛠️  User Profile Fix Functions Available:');
  console.log('  - fixUserProfiles() - Fix profiles missing user_type');
  console.log('  - checkUserProfileStructure() - Check table structure');
}