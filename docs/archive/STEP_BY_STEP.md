# 📺 Step-by-Step Video Guide

## Follow Along - Takes 2 Minutes

---

### 🎬 SCENE 1: Open Supabase

**Action:**
1. Open a new browser tab
2. Go to: `https://supabase.com/dashboard`
3. You'll see your projects list
4. Click on your project name

**You should see:** Your project dashboard

---

### 🎬 SCENE 2: Open SQL Editor

**Action:**
1. Look at the left sidebar
2. Find "SQL Editor" (has a 📝 icon)
3. Click on it

**You should see:** SQL Editor page with example queries

---

### 🎬 SCENE 3: Create New Query

**Action:**
1. Look for the "+ New Query" button (top right area)
2. Click it

**You should see:** A blank SQL editor box

---

### 🎬 SCENE 4: Paste the SQL

**Action:**
1. Copy this ENTIRE block:

```sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_onboarding_complete BOOLEAN DEFAULT FALSE;
NOTIFY pgrst, 'reload schema';
```

2. Click in the SQL editor box
3. Paste (Ctrl+V or Cmd+V)

**You should see:** The SQL code in the editor

---

### 🎬 SCENE 5: Run the Query

**Action:**
1. Look for the "Run" button (usually green, top right of editor)
2. Click it
   - OR press Ctrl+Enter (Windows/Linux)
   - OR press Cmd+Enter (Mac)

**You should see:** 
- A loading spinner briefly
- Then: "Success. No rows returned"
- Status: ✅ (green checkmark)

**If you see an error:** Take a screenshot and check the troubleshooting section below

---

### 🎬 SCENE 6: Verify It Worked

**Action:**
1. Clear the SQL editor
2. Paste this:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('department', 'employee_id', 'phone', 'address', 'is_onboarding_complete');
```

3. Click "Run"

**You should see:** 
- A table with 5 rows
- Column names: address, department, employee_id, is_onboarding_complete, phone

**If you see less than 5 rows:** The columns weren't created. Try Scene 5 again.

---

### 🎬 SCENE 7: Restart Your App

**Action:**
1. Go to your terminal (where npm run dev is running)
2. Press Ctrl+C to stop the server
3. Type: `npm run dev`
4. Press Enter

**You should see:** Server starting up again

---

### 🎬 SCENE 8: Clear Browser Cache

**Action:**

**Option A - Quick:**
- Press Ctrl+Shift+R (Windows/Linux)
- Press Cmd+Shift+R (Mac)

**Option B - Thorough:**
1. Press F12 to open DevTools
2. Right-click the refresh button (next to address bar)
3. Select "Empty Cache and Hard Reload"

**You should see:** Page reloads

---

### 🎬 SCENE 9: Test the Form

**Action:**
1. Go to your app
2. Click "Access as Worker"
3. Login with your credentials
4. Fill out the onboarding form:
   - Full Name: Your Name
   - Employee ID: EMP-001
   - Department: Select from dropdown
   - Phone: 555-1234
   - Address: Your address
5. Click "Complete Profile"

**You should see:** 
- Form submits successfully
- Redirects to dashboard
- No error messages! 🎉

---

## 🎉 SUCCESS!

If you made it here, your database is now set up correctly!

---

## 🚨 Troubleshooting

### Scene 5 - Error: "permission denied"

**Fix:** You don't have permission to alter the table.
- Check if you're the project owner
- Or ask the project owner to run the migration

### Scene 5 - Error: "relation does not exist"

**Fix:** The user_profiles table doesn't exist.
- Check if you're in the correct project
- Verify the table name in Table Editor

### Scene 6 - Shows 0 rows

**Fix:** Columns weren't created.
- Go back to Scene 4
- Make sure you copied ALL the SQL
- Try running each ALTER TABLE line separately

### Scene 9 - Still shows error

**Fix:** Cache issue.
- Close ALL browser tabs of your app
- Stop the dev server (Ctrl+C)
- Start it again (npm run dev)
- Open app in new tab
- Try again

---

## 📸 Screenshots Checklist

If you need help, take screenshots of:
- [ ] Scene 5 result (Success or Error message)
- [ ] Scene 6 result (List of columns)
- [ ] Scene 9 error (If still getting error)
- [ ] Browser console (F12 → Console tab)

---

## ⏱️ Time Breakdown

- Scene 1-3: 30 seconds
- Scene 4-5: 30 seconds
- Scene 6: 15 seconds
- Scene 7-8: 45 seconds
- Scene 9: 30 seconds

**Total: ~2.5 minutes**

---

## 🎯 Quick Reference

**Problem:** Database schema not updated
**Solution:** Run migration in Supabase SQL Editor
**Time:** 2-3 minutes
**Difficulty:** Easy
**One-time:** Yes, never need to do again

---

**You got this! Follow each scene and you'll be done in no time!** 🚀
