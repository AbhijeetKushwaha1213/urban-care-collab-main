# 🚀 Citizen Feedback System - Quick Setup

## What This Does

When an issue is resolved, the citizen who reported it can:
- ✅ **Rate as Satisfied** → Issue permanently closed
- ❌ **Rate as Not Satisfied** → Issue reopened for rework

---

## 📋 Setup (2 Steps)

### Step 1: Run SQL in Supabase

```sql
ALTER TABLE issues ADD COLUMN IF NOT EXISTS citizen_feedback VARCHAR(20) CHECK (citizen_feedback IN ('satisfied', 'not_satisfied'));
ALTER TABLE issues ADD COLUMN IF NOT EXISTS citizen_feedback_comment TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS citizen_feedback_at TIMESTAMP WITH TIME ZONE;
CREATE INDEX IF NOT EXISTS idx_issues_citizen_feedback ON issues(citizen_feedback) WHERE citizen_feedback IS NOT NULL;
NOTIFY pgrst, 'reload schema';
```

### Step 2: Restart Dev Server

```bash
npm run dev
```

---

## ✅ How It Works

### For Citizens:

**1. Issue Gets Resolved**
- Worker uploads after photo
- Admin approves
- Status changes to "resolved"

**2. Citizen Sees Feedback Button**
- Opens their issue
- Sees green banner: "Rate This Resolution"
- Clicks button

**3. Provides Feedback**
- Selects Satisfied or Not Satisfied
- Adds comment (required if not satisfied)
- Submits

**4. Automatic Action**
- **Satisfied** → Issue closed permanently ✅
- **Not Satisfied** → Issue reopened ❌

---

## 🎯 Key Features

### Satisfied Feedback:
```
✅ Issue Status: closed
✅ Removed from active issues
✅ Success story remains
✅ Worker gets recognition
```

### Not Satisfied Feedback:
```
❌ Issue Status: reported (reopened)
❌ Appears in worker dashboard
❌ Comment added with feedback
❌ Worker/admin notified
```

---

## 🧪 Quick Test

1. **Create an issue** as citizen
2. **Resolve it** as worker (upload after photo)
3. **Login as citizen** again
4. **Open the issue**
5. **Click "Rate This Resolution"**
6. **Select feedback** and submit
7. **Verify** status changed

---

## 📚 Full Documentation

See `docs/CITIZEN_FEEDBACK_SYSTEM.md` for complete details.

---

**Citizens now have the final say on issue resolution!** 🎉
