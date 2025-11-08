# 🚨 FIX: Add after_image Column

## Copy & Paste This Into Supabase SQL Editor:

```sql
ALTER TABLE issues ADD COLUMN IF NOT EXISTS after_image TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT FALSE;

ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check;
ALTER TABLE issues ADD CONSTRAINT issues_status_check 
  CHECK (status IN ('reported', 'assigned', 'in_progress', 'pending_approval', 'resolved', 'closed'));

NOTIFY pgrst, 'reload schema';
```

## Steps:

1. **Go to**: https://supabase.com/dashboard
2. **Click**: SQL Editor → New Query
3. **Paste** the code above
4. **Click**: Run
5. **Restart** your dev server: `npm run dev`
6. **Refresh** browser (Ctrl+Shift+R)
7. **Try uploading again** ✅

## Verify:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('after_image', 'completed_at', 'show_in_gallery');
```

Should return 3 rows.

---

**This is the same issue as before - the database columns don't exist yet!**

Run the SQL above and it will work. 🚀
