# 📺 Visual Guide: Add after_image Column

## The Problem:

```
❌ Failed to upload photo: Could not find the 'after_image' 
   column of 'issues' in the schema cache
```

**Translation:** The database table doesn't have the column yet.

---

## The Solution (2 Minutes):

### Step 1: Open Supabase Dashboard

```
Browser → https://supabase.com/dashboard
    ↓
Select Your Project
    ↓
Look at Left Sidebar
```

### Step 2: Open SQL Editor

```
Left Sidebar:
├── Table Editor
├── SQL Editor  ← CLICK HERE
├── Database
└── Authentication
```

### Step 3: Create New Query

```
SQL Editor Page:
    ↓
Top Right Corner
    ↓
[+ New Query] ← CLICK HERE
```

### Step 4: Paste This SQL

```sql
-- Copy ALL of this:

ALTER TABLE issues ADD COLUMN IF NOT EXISTS after_image TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT FALSE;

ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check;
ALTER TABLE issues ADD CONSTRAINT issues_status_check 
  CHECK (status IN ('reported', 'assigned', 'in_progress', 'pending_approval', 'resolved', 'closed'));

NOTIFY pgrst, 'reload schema';
```

### Step 5: Run It

```
SQL Editor:
    ↓
[▶ Run] Button (or Ctrl+Enter)
    ↓
Wait 1-2 seconds
    ↓
Should see: "Success. No rows returned"
```

### Step 6: Verify

Paste and run this:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('after_image', 'completed_at', 'show_in_gallery');
```

**Expected Result:**
```
column_name
-----------------
after_image
completed_at
show_in_gallery
```

**If you see 3 rows → SUCCESS! ✅**

### Step 7: Restart Your App

In your terminal:

```bash
# Press Ctrl+C to stop
# Then:
npm run dev
```

### Step 8: Refresh Browser

```
Press: Ctrl + Shift + R (Windows/Linux)
   or: Cmd + Shift + R (Mac)
```

### Step 9: Try Upload Again

```
Worker Dashboard
    ↓
Open Issue
    ↓
Upload After Photo
    ↓
Should work now! ✅
```

---

## 🎯 Quick Checklist:

- [ ] Opened Supabase Dashboard
- [ ] Clicked SQL Editor
- [ ] Clicked New Query
- [ ] Pasted the SQL
- [ ] Clicked Run
- [ ] Saw "Success" message
- [ ] Verified 3 columns exist
- [ ] Restarted dev server
- [ ] Refreshed browser
- [ ] Tested upload - WORKS! ✅

---

## 🔍 Troubleshooting:

### "Permission denied"
- You need to be project owner
- Or ask owner to run the SQL

### "Relation does not exist"
- Wrong project selected
- Check you're in the correct Supabase project

### Still seeing error after running SQL
- Did you restart dev server?
- Did you refresh browser?
- Try closing ALL browser tabs and reopening

### Columns don't appear in verification
- SQL didn't run successfully
- Check for error messages
- Try running each ALTER TABLE separately

---

## 💡 Why This Happens:

The after_image feature needs these database columns:
- `after_image` - Stores the photo
- `completed_at` - When it was completed
- `show_in_gallery` - Whether to show in success stories

Your database doesn't have them yet, so you need to add them once.

**This is a ONE-TIME setup!**

---

## ✅ After Running Migration:

- ✅ Upload will work
- ✅ Photos will save
- ✅ Status will change
- ✅ Admin can approve
- ✅ Success stories will show

---

**Follow the steps above and it will work!** 🚀
