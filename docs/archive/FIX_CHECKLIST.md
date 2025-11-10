# ✅ Fix Department Error - Complete Checklist

## Follow These Steps in Order:

### ☐ Step 1: Open Supabase SQL Editor
- Go to: https://supabase.com/dashboard
- Select your project
- Click "SQL Editor" (left sidebar)
- Click "New Query"

### ☐ Step 2: Check If Columns Exist

Paste and run:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('department', 'employee_id', 'phone', 'address', 'is_onboarding_complete');
```

**Expected Result:** 5 rows

**If you see less than 5 rows**, continue to Step 3.
**If you see 5 rows**, skip to Step 4.

### ☐ Step 3: Add Missing Columns

Paste and run this (even if you ran it before):
```sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_onboarding_complete BOOLEAN DEFAULT FALSE;
```

**Expected Result:** `Success. No rows returned`

### ☐ Step 4: Force Schema Refresh

Paste and run:
```sql
NOTIFY pgrst, 'reload schema';
```

**Expected Result:** `Success. No rows returned`

### ☐ Step 5: Verify Columns Now Exist

Run Step 2 query again:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('department', 'employee_id', 'phone', 'address', 'is_onboarding_complete');
```

**Must show 5 rows!** If not, something is wrong with your database permissions.

### ☐ Step 6: Restart Your Dev Server

In your terminal:
```bash
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

### ☐ Step 7: Clear Browser Cache

**Chrome/Edge/Firefox:**
- Press `Ctrl + Shift + R` (Windows/Linux)
- Press `Cmd + Shift + R` (Mac)

**Or:**
- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

### ☐ Step 8: Test Again

1. Go to your app
2. Login as worker
3. Fill out the onboarding form
4. Click "Complete Profile"

**Should work now!** ✅

---

## 🚨 Still Not Working?

### Check Your .env File

Make sure you have the correct Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Verify in Supabase Dashboard

1. Go to **Table Editor**
2. Click `user_profiles` table
3. Look at the columns list on the left
4. You should see: department, employee_id, phone, address

### Try Manual Update

In SQL Editor:
```sql
-- Find your user
SELECT id, email FROM user_profiles WHERE email = 'your-email@example.com';

-- Try to update (replace YOUR-USER-ID)
UPDATE user_profiles 
SET department = 'Test', employee_id = 'TEST-001'
WHERE id = 'YOUR-USER-ID';
```

If this works, the columns exist and it's a caching issue.

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Share the exact error message

---

## 📞 Need More Help?

If none of this works, provide:
1. Screenshot of Step 2 results (column check)
2. Screenshot of error in browser console
3. Your Supabase project region
4. Node.js version (`node --version`)

---

## ✅ Success Indicators

You'll know it's fixed when:
- ✅ Step 2 shows 5 columns
- ✅ No error in browser console
- ✅ Form submits successfully
- ✅ Redirects to dashboard
- ✅ Data saved in database

---

## 🎯 Quick Reference

**Problem:** `Could not find the 'department' column`

**Cause:** Database columns not created

**Solution:** Run migration → Refresh schema → Restart server → Clear cache

**Time:** 2-3 minutes total
