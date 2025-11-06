-- Fix user_type field in user_profiles table
-- Run this in your Supabase SQL Editor

-- 1. Add user_type column if it doesn't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'citizen';

-- 2. Add department column if it doesn't exist  
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS department TEXT;

-- 3. Create index for user_type for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);

-- 4. Update any existing profiles without user_type to be citizens
UPDATE user_profiles 
SET user_type = 'citizen' 
WHERE user_type IS NULL;

-- 5. Verify the changes
SELECT 
  id, 
  email, 
  full_name, 
  user_type, 
  department, 
  is_onboarding_complete,
  created_at 
FROM user_profiles 
ORDER BY created_at DESC 
LIMIT 10;

-- Success message
SELECT 'user_type field added successfully!' as result;