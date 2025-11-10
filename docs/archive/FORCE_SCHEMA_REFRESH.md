# Force Schema Refresh - Fix Department Column Error

## 🔧 Step-by-Step Fix

### Step 1: Verify Columns Exist in Database

Run this in Supabase SQL Editor:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
ORDER BY column_name;
```

**Look for these columns:**
- `department`
- `employee_id`
- `phone`
- `address`
- `is_onboarding_complete`

**If they DON'T appear**, run this first:

```sql
ALTER TABLE user_profiles ADD COLUMN department VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN employee_id VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN phone VARCHAR(20);
ALTER TABLE user_profiles ADD COLUMN address TEXT;
ALTER TABLE user_profiles ADD COLUMN is_onboarding_complete BOOLEAN DEFAULT FALSE;
```

---

### Step 2: Force Refresh Supabase Schema Cache

In Supabase SQL Editor, run:

```sql
-- Force schema cache refresh
NOTIFY pgrst, 'reload schema';
```

---

### Step 3: Restart Your Local Dev Server

In your terminal:

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

---

### Step 4: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

Or just:
- Chrome/Edge: Ctrl+Shift+R
- Mac: Cmd+Shift+R

---

### Step 5: Test Again

1. Go to worker login
2. Complete the profile form
3. Should work now! ✅

---

## 🔍 Still Not Working?

### Check Supabase Connection

Make sure your `.env` or environment variables have the correct Supabase URL and key:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Verify in Supabase Dashboard

1. Go to **Table Editor**
2. Click on `user_profiles` table
3. You should see the new columns in the column list

### Manual Test

Try updating directly in SQL:

```sql
UPDATE user_profiles 
SET 
  department = 'Test Department',
  employee_id = 'TEST-001',
  phone = '555-1234',
  address = 'Test Address'
WHERE id = 'your-user-id';
```

If this works, the columns exist and it's a cache issue.

---

## 🚨 Nuclear Option: Drop and Recreate

**⚠️ WARNING: Only if nothing else works!**

```sql
-- Backup your data first!
CREATE TABLE user_profiles_backup AS SELECT * FROM user_profiles;

-- Add columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_onboarding_complete BOOLEAN DEFAULT FALSE;

-- Force refresh
NOTIFY pgrst, 'reload schema';
```

---

## ✅ Success Indicators

You'll know it's fixed when:
- No error in browser console
- Profile saves successfully
- Redirects to dashboard
- Data appears in database
