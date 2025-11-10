# 📖 How to Run SQL in Supabase - Complete Guide

## Step-by-Step Instructions

---

## Step 1: Open Your Browser

Open any web browser (Chrome, Firefox, Safari, Edge)

---

## Step 2: Go to Supabase

Type this in the address bar:
```
https://supabase.com/dashboard
```

Press Enter

---

## Step 3: Login (if needed)

If you're not logged in:
- Enter your email
- Enter your password
- Click "Sign In"

---

## Step 4: You'll See Your Projects

You should see a page that looks like this:

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
├─────────────────────────────────────────┤
│                                         │
│  Your Projects:                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📦 Your Project Name           │   │
│  │  Active • Region: us-east-1     │   │
│  │  [Open Project]                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Click on your project** (the one you're using for your app)

---

## Step 5: You're Now Inside Your Project

You'll see a page with a sidebar on the left:

```
┌──────────────┬──────────────────────────┐
│              │                          │
│  ☰ Menu      │  Project Dashboard       │
│              │                          │
│  📊 Home     │  [Your project info]     │
│  📝 Table    │                          │
│     Editor   │                          │
│  📝 SQL      │  ← WE NEED THIS!         │
│     Editor   │                          │
│  🗄️  Database│                          │
│  🔐 Auth     │                          │
│  📦 Storage  │                          │
│              │                          │
└──────────────┴──────────────────────────┘
```

---

## Step 6: Click "SQL Editor"

Look at the left sidebar and find **"SQL Editor"**

It might have an icon that looks like: 📝 or </> 

**Click on it**

---

## Step 7: SQL Editor Opens

You'll see a page like this:

```
┌─────────────────────────────────────────┐
│  SQL Editor                             │
├─────────────────────────────────────────┤
│                                         │
│  [+ New Query]  [Templates ▼]          │
│                                         │
│  Recent Queries:                        │
│  - Query 1                              │
│  - Query 2                              │
│                                         │
│  Templates:                             │
│  - Create table                         │
│  - Insert data                          │
│                                         │
└─────────────────────────────────────────┘
```

---

## Step 8: Click "New Query"

Look for the **"+ New Query"** button (usually top right or top left)

**Click it**

---

## Step 9: Empty SQL Editor Appears

You'll see a blank text box like this:

```
┌─────────────────────────────────────────┐
│  Untitled Query                         │
├─────────────────────────────────────────┤
│                                         │
│  1 │                                    │
│  2 │  [Cursor blinking here]            │
│  3 │                                    │
│  4 │                                    │
│  5 │                                    │
│                                         │
│                                         │
│  [▶ Run]  [Save]                       │
└─────────────────────────────────────────┘
```

---

## Step 10: Copy the SQL Code

**Open this file on your computer:**
- Look for: `FIX_AFTER_IMAGE_NOW.md`
- Or copy from below:

```sql
ALTER TABLE issues ADD COLUMN IF NOT EXISTS after_image TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT FALSE;

ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check;
ALTER TABLE issues ADD CONSTRAINT issues_status_check 
  CHECK (status IN ('reported', 'assigned', 'in_progress', 'pending_approval', 'resolved', 'closed'));

NOTIFY pgrst, 'reload schema';
```

**How to copy:**
1. Click at the start of the code
2. Hold Shift and click at the end
3. Press Ctrl+C (Windows/Linux) or Cmd+C (Mac)

---

## Step 11: Paste Into SQL Editor

**Click inside the SQL Editor text box**

**Paste the code:**
- Press Ctrl+V (Windows/Linux)
- Or Cmd+V (Mac)

You should now see:

```
┌─────────────────────────────────────────┐
│  Untitled Query                         │
├─────────────────────────────────────────┤
│                                         │
│  1 │ ALTER TABLE issues ADD COLUMN...   │
│  2 │ ALTER TABLE issues ADD COLUMN...   │
│  3 │ ALTER TABLE issues ADD COLUMN...   │
│  4 │                                    │
│  5 │ ALTER TABLE issues DROP...         │
│  6 │ ALTER TABLE issues ADD...          │
│  7 │                                    │
│  8 │ NOTIFY pgrst, 'reload schema';     │
│                                         │
│  [▶ Run]  [Save]                       │
└─────────────────────────────────────────┘
```

---

## Step 12: Run the SQL

Look for the **"Run"** button

It might look like:
- `[▶ Run]`
- `[Run Query]`
- `[Execute]`
- Or just a play button: ▶

**Click it!**

Or press:
- Ctrl+Enter (Windows/Linux)
- Cmd+Enter (Mac)

---

## Step 13: Wait for Result

You'll see a loading indicator for 1-2 seconds...

Then you should see:

```
┌─────────────────────────────────────────┐
│  Results                                │
├─────────────────────────────────────────┤
│                                         │
│  ✅ Success. No rows returned           │
│                                         │
│  Rows: 0                                │
│  Time: 0.5s                             │
│                                         │
└─────────────────────────────────────────┘
```

**If you see "Success" - YOU'RE DONE!** ✅

---

## Step 14: Verify It Worked (Optional)

To double-check, create another new query and paste:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('after_image', 'completed_at', 'show_in_gallery');
```

Run it.

You should see:

```
┌─────────────────────────────────────────┐
│  Results                                │
├─────────────────────────────────────────┤
│  column_name                            │
│  ─────────────────                      │
│  after_image                            │
│  completed_at                           │
│  show_in_gallery                        │
│                                         │
│  Rows: 3                                │
└─────────────────────────────────────────┘
```

**If you see 3 rows - PERFECT!** ✅

---

## Step 15: Go Back to Your App

Now go back to your terminal where your app is running.

---

## Step 16: Restart Your App

In the terminal:

1. **Stop the server:**
   - Press `Ctrl+C`
   - You'll see the server stop

2. **Start it again:**
   - Type: `npm run dev`
   - Press Enter
   - Wait for it to start

---

## Step 17: Refresh Your Browser

Go to your app in the browser.

**Hard refresh:**
- Windows/Linux: Press `Ctrl + Shift + R`
- Mac: Press `Cmd + Shift + R`

Or:
- Press F12 to open DevTools
- Right-click the refresh button
- Select "Empty Cache and Hard Reload"

---

## Step 18: Try Uploading Again

1. Go to worker dashboard
2. Open an issue
3. Scroll to "After Photo" section
4. Click "Choose Photo"
5. Select an image
6. Click "Upload After Photo"

**It should work now!** ✅

---

## 🎉 Success!

You should see:
```
✅ After photo uploaded successfully! 
   Issue marked as pending approval.
```

---

## 🚨 Troubleshooting

### "Permission denied for table issues"

**Problem:** You don't have permission to modify the table.

**Solution:** 
- Make sure you're the project owner
- Or ask the project owner to run the SQL

### "Relation 'issues' does not exist"

**Problem:** You're in the wrong project or the table doesn't exist.

**Solution:**
- Check you selected the correct project
- Go to Table Editor and verify "issues" table exists

### Still seeing "column not found" error

**Problem:** Cache not refreshed.

**Solution:**
1. Close ALL browser tabs of your app
2. Stop dev server (Ctrl+C)
3. Start dev server again (`npm run dev`)
4. Open app in NEW browser tab
5. Try again

### SQL Editor not showing

**Problem:** You might not have access.

**Solution:**
- Check you're logged in as project owner
- Try refreshing the Supabase dashboard page

---

## 📸 Visual Reference

### Where is SQL Editor?

```
Supabase Dashboard Left Sidebar:

┌─────────────────────┐
│ 🏠 Home             │
│ 📊 Table Editor     │
│ 📝 SQL Editor       │ ← HERE!
│ 🗄️  Database        │
│ 🔐 Authentication   │
│ 📦 Storage          │
│ ⚙️  Settings        │
└─────────────────────┘
```

### What does "Run" button look like?

It could be:
- Green button with "Run" text
- Play icon: ▶
- "Execute" button
- Usually in top right of SQL editor

---

## ⏱️ Time Breakdown

- Step 1-6: Finding SQL Editor (1 minute)
- Step 7-11: Pasting SQL (30 seconds)
- Step 12-13: Running SQL (10 seconds)
- Step 14: Verification (30 seconds)
- Step 15-17: Restart app (1 minute)
- Step 18: Test upload (30 seconds)

**Total: ~3-4 minutes**

---

## ✅ Final Checklist

- [ ] Opened Supabase Dashboard
- [ ] Found my project
- [ ] Clicked SQL Editor
- [ ] Clicked New Query
- [ ] Pasted the SQL code
- [ ] Clicked Run button
- [ ] Saw "Success" message
- [ ] Verified 3 columns exist
- [ ] Restarted dev server
- [ ] Refreshed browser
- [ ] Tested upload
- [ ] IT WORKS! 🎉

---

## 🎯 Quick Summary

1. **Supabase Dashboard** → **SQL Editor** → **New Query**
2. **Paste SQL** → **Click Run**
3. **Restart app** → **Refresh browser**
4. **Test upload** → **Success!** ✅

---

**You got this!** Follow each step and you'll have it working in a few minutes! 🚀
