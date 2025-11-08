# Fix "Could not find 'department' column" Error

## 🚨 Problem

You're seeing this error:
```
Could not find the 'department' column of 'user_profiles' in the schema cache
```

This means the database columns haven't been created yet.

---

## ✅ Solution (2 Minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: `https://supabase.com/dashboard`
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run This SQL

Copy and paste this entire script:

```sql
-- Add all required columns for worker profiles
ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS department VARCHAR(100);

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50) UNIQUE;

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE user_profiles 
  ADD COLUMN IF NOT EXISTS is_onboarding_complete BOOLEAN DEFAULT FALSE;

-- Update user_type constraint
ALTER TABLE user_profiles 
  DROP CONSTRAINT IF EXISTS user_profiles_user_type_check;

ALTER TABLE user_profiles 
  ADD CONSTRAINT user_profiles_user_type_check 
  CHECK (user_type IN ('citizen', 'authority', 'official'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_department 
  ON user_profiles(department) 
  WHERE user_type = 'official';

CREATE INDEX IF NOT EXISTS idx_user_profiles_employee_id 
  ON user_profiles(employee_id);
```

### Step 3: Click "Run" (or press Ctrl+Enter)

You should see: `Success. No rows returned`

### Step 4: Verify It Worked

Run this query:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('department', 'employee_id', 'phone', 'address');
```

You should see 4 rows:
- department
- employee_id
- phone
- address

### Step 5: Try Again

1. Go back to your app
2. Login as worker
3. The onboarding page should now work! ✅

---

## 🎯 What This Does

Adds these columns to your `user_profiles` table:

| Column | Type | Purpose |
|--------|------|---------|
| `department` | VARCHAR(100) | Worker's department |
| `employee_id` | VARCHAR(50) | Unique employee ID |
| `phone` | VARCHAR(20) | Contact phone |
| `address` | TEXT | Residential address |
| `is_onboarding_complete` | BOOLEAN | Profile setup status |

---

## 🧪 Quick Test

After running the migration:

1. **Login to worker portal**
2. **You'll see onboarding page**
3. **Fill out the form**:
   - Name: Test Worker
   - Employee ID: EMP-001
   - Department: Public Works
   - Phone: 555-1234
   - Address: 123 Main St
4. **Click "Complete Profile"**
5. **Should redirect to dashboard** ✅

---

## 🔍 Troubleshooting

### Still seeing the error?

**Check if columns exist:**
```sql
\d user_profiles
-- or
SELECT * FROM information_schema.columns 
WHERE table_name = 'user_profiles';
```

**Manually add missing column:**
```sql
ALTER TABLE user_profiles ADD COLUMN department VARCHAR(100);
```

### "Column already exists" error?

That's fine! It means the column was already there. The `IF NOT EXISTS` clause should prevent this, but if you see it, just ignore it.

### Need to reset?

```sql
-- Only if you need to start over
ALTER TABLE user_profiles DROP COLUMN IF EXISTS department;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS employee_id;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS phone;
ALTER TABLE user_profiles DROP COLUMN IF EXISTS address;

-- Then run the migration again
```

---

## 📝 Alternative: Use the Complete Script

If you want to run everything at once, use:

**File:** `docs/migration/COMPLETE_WORKER_SETUP.sql`

This includes:
- All column additions
- Indexes for performance
- Constraints
- Comments
- Verification queries

---

## ✅ Success Checklist

- [ ] Opened Supabase SQL Editor
- [ ] Ran the migration script
- [ ] Saw "Success" message
- [ ] Verified columns exist
- [ ] Tested onboarding page
- [ ] Profile saved successfully

---

## 🎉 Done!

Your database is now ready for worker onboarding. The error should be gone and you can complete your worker profile!

---

## 💡 Why This Happened

The worker onboarding feature requires additional database columns that weren't in the original schema. This is a one-time setup that adds those columns.

After running this migration once, all future workers will be able to complete their profiles without any issues.
