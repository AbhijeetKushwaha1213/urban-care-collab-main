# 🚀 Quick Setup - After Image Feature

## ⚠️ Important: Run This First!

The after image upload requires database columns. Run this SQL in Supabase:

### Copy & Paste This:

```sql
-- Add required columns
ALTER TABLE issues ADD COLUMN IF NOT EXISTS after_image TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT FALSE;

-- Update status constraint
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check;
ALTER TABLE issues ADD CONSTRAINT issues_status_check 
  CHECK (status IN ('reported', 'assigned', 'in_progress', 'pending_approval', 'resolved', 'closed'));

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_issues_after_image ON issues(after_image) WHERE after_image IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_issues_pending_approval ON issues(status) WHERE status = 'pending_approval';
```

### Verify It Worked:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('after_image', 'completed_at', 'show_in_gallery');
```

Should return 3 rows.

---

## ✅ How It Works Now

### 1. Worker Uploads Photo

- Opens issue in worker dashboard
- Scrolls to "After Photo" section
- Clicks "Choose Photo"
- Selects image
- Clicks "Upload After Photo"
- **Status automatically changes to "pending_approval"**

### 2. Photo is Saved

- Image converted to base64
- Saved directly in database
- No storage bucket needed
- Works immediately

### 3. Admin Reviews

- Sees issue in "pending_approval" status
- Views before/after photos
- Approves or rejects

### 4. Success Story

- When admin approves:
  - Status → "resolved"
  - show_in_gallery → TRUE
  - Appears in homepage success stories

---

## 🎯 Complete Flow

```
Worker Dashboard
    ↓
Open Issue
    ↓
Upload After Photo
    ↓
Status: pending_approval ✅
    ↓
Admin Reviews
    ↓
Admin Approves
    ↓
Status: resolved ✅
show_in_gallery: TRUE ✅
    ↓
Success Story on Homepage 🎉
```

---

## 🧪 Test It Now

### Step 1: Upload Photo
1. Login as worker
2. Open any issue
3. Scroll to "After Photo" section
4. Upload a test image
5. Should see success message

### Step 2: Verify in Database
```sql
SELECT id, title, status, after_image, completed_at
FROM issues
WHERE after_image IS NOT NULL
ORDER BY completed_at DESC
LIMIT 5;
```

### Step 3: Admin Approval (Manual for now)
```sql
-- Approve an issue
UPDATE issues
SET status = 'resolved', show_in_gallery = TRUE
WHERE id = 'your-issue-id';
```

### Step 4: Check Success Stories
- Go to homepage
- Should see the issue in success stories
- Before/after photos visible

---

## 📝 What Changed

### Before:
- ❌ No way to upload after photo from issue details
- ❌ Had to go to separate upload page
- ❌ Manual status changes

### After:
- ✅ Upload directly from issue details
- ✅ Automatic status change to pending_approval
- ✅ Base64 storage (no bucket setup needed)
- ✅ Ready for admin approval workflow

---

## 🔧 Troubleshooting

### "Failed to upload photo"

**Check:**
1. Did you run the SQL migration?
2. Is the image less than 5MB?
3. Check browser console for errors

**Fix:**
```sql
-- Verify columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name = 'after_image';
```

### Photo not appearing

**Check:**
1. Refresh the page
2. Check database:
```sql
SELECT after_image FROM issues WHERE id = 'your-issue-id';
```

### Status not changing

**Check:**
```sql
-- Verify status constraint includes pending_approval
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'issues'::regclass 
AND conname LIKE '%status%';
```

---

## 🎉 You're Ready!

After running the SQL migration:
- ✅ Workers can upload after photos
- ✅ Photos saved automatically
- ✅ Status changes to pending_approval
- ✅ Ready for admin approval
- ✅ Success stories work

**No storage bucket configuration needed!** 🚀
