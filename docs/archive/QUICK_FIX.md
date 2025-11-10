# 🚀 QUICK FIX - Department Column Error

## Copy & Paste This Into Supabase SQL Editor:

```sql
-- Add worker profile columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50) UNIQUE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_onboarding_complete BOOLEAN DEFAULT FALSE;

-- Update user type constraint
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_type_check CHECK (user_type IN ('citizen', 'authority', 'official'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_department ON user_profiles(department) WHERE user_type = 'official';
CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id ON user_profiles(employee_id);
```

## Steps:

1. **Go to Supabase Dashboard** → **SQL Editor** → **New Query**
2. **Paste the code above**
3. **Click "Run"**
4. **Done!** ✅

## Verify:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('department', 'employee_id', 'phone', 'address');
```

Should return 4 rows.

## Now Try Again:

Go back to your app and complete the worker profile. It should work now! 🎉
