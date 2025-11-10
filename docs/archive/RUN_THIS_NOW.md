# 🚀 RUN THIS NOW - Fix Database

## You Need to Add Columns to Your Database

### 📍 WHERE TO GO:

1. Open: **https://supabase.com/dashboard**
2. Click your project
3. Click **"SQL Editor"** (in the left menu)
4. Click **"New Query"** button

### 📋 WHAT TO PASTE:

Copy this ENTIRE block and paste it:

```sql
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS department VARCHAR(100);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_onboarding_complete BOOLEAN DEFAULT FALSE;
NOTIFY pgrst, 'reload schema';
```

### ▶️ WHAT TO DO:

1. Click the **"Run"** button (or press Ctrl+Enter)
2. You should see: **"Success. No rows returned"**
3. That's it! ✅

### 🔄 THEN:

1. **Restart your app**:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

2. **Refresh your browser** (Ctrl+Shift+R)

3. **Try the form again** - It will work! 🎉

---

## 🎯 Visual Guide:

```
┌─────────────────────────────────────────┐
│  Supabase Dashboard                     │
├─────────────────────────────────────────┤
│  ☰ Menu                                 │
│    📊 Table Editor                      │
│    📝 SQL Editor  ← CLICK HERE          │
│    🔐 Authentication                    │
│    📦 Storage                           │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  SQL Editor                             │
├─────────────────────────────────────────┤
│  [+ New Query] ← CLICK HERE             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Paste the SQL here                │ │
│  │                                   │ │
│  │ ALTER TABLE user_profiles...      │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [▶ Run] ← CLICK HERE                  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Result                                 │
├─────────────────────────────────────────┤
│  ✅ Success. No rows returned           │
└─────────────────────────────────────────┘
```

---

## ❓ What This Does:

Adds 5 new columns to your database:
- `department` - For worker's department
- `employee_id` - For employee ID
- `phone` - For phone number
- `address` - For address
- `is_onboarding_complete` - Tracks if profile is complete

---

## ✅ How to Know It Worked:

After running the SQL, run this to verify:

```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name IN ('department', 'employee_id', 'phone', 'address');
```

Should show 4 rows with those column names.

---

## 🆘 Still Stuck?

Make sure:
- ✅ You're in the correct Supabase project
- ✅ You clicked "Run" after pasting
- ✅ You saw "Success" message
- ✅ You restarted your dev server
- ✅ You refreshed your browser

---

**This is a ONE-TIME setup. Once done, it works forever!** 🚀
