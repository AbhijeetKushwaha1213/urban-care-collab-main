# ⚡ Super Simple Steps

## 5 Steps to Fix the Error:

### 1️⃣ Open Supabase
Go to: **https://supabase.com/dashboard**

### 2️⃣ Click SQL Editor
Left sidebar → Click **"SQL Editor"** → Click **"+ New Query"**

### 3️⃣ Paste This Code
```sql
ALTER TABLE issues ADD COLUMN IF NOT EXISTS after_image TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS show_in_gallery BOOLEAN DEFAULT FALSE;
ALTER TABLE issues DROP CONSTRAINT IF EXISTS issues_status_check;
ALTER TABLE issues ADD CONSTRAINT issues_status_check CHECK (status IN ('reported', 'assigned', 'in_progress', 'pending_approval', 'resolved', 'closed'));
NOTIFY pgrst, 'reload schema';
```

### 4️⃣ Click Run
Click the **"Run"** button (or press Ctrl+Enter)

Should see: **"✅ Success"**

### 5️⃣ Restart Your App
```bash
# In terminal, press Ctrl+C, then:
npm run dev
```

Refresh browser (Ctrl+Shift+R)

---

## ✅ Done!

Try uploading the photo again - it will work! 🎉

---

## 🆘 Need More Help?

See: **`HOW_TO_RUN_SQL_IN_SUPABASE.md`** for detailed step-by-step with screenshots descriptions.
