# 🚀 Quick Start: Create Official Account in 3 Minutes

## ✅ Simple 6-Step Process

### Step 1: Open Supabase
Go to: `https://supabase.com/dashboard` → Select your project

### Step 2: Create User
1. Click **Authentication** → **Users**
2. Click **"Add User"** button
3. Enter:
   - Email: `official@test.com`
   - Password: `Test@123456`
4. Click **"Create User"**
5. **COPY THE USER ID** (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### Step 3: Run SQL
1. Click **SQL Editor** → **New Query**
2. Paste this (replace `YOUR-USER-ID` with the ID you copied):

```sql
INSERT INTO user_profiles (
  id, email, full_name, user_type, department, employee_id, is_onboarding_complete, created_at
) VALUES (
  'YOUR-USER-ID',
  'official@test.com',
  'Test Official',
  'official',
  'Public Works Department',
  'EMP-001',
  true,
  NOW()
);
```

3. Click **"Run"**

### Step 4: Verify
Run this to check:
```sql
SELECT email, user_type FROM user_profiles WHERE email = 'official@test.com';
```
Should show: `user_type = 'official'` ✅

### Step 5: Login
1. Go to: `http://localhost:5173/`
2. Click **"Access as Worker"**
3. Login with:
   - Email: `official@test.com`
   - Password: `Test@123456`

### Step 6: Success! 🎉
You should now see the **Official Dashboard**!

---

## 🔄 Alternative: Use Your Current Account

Want to use your existing account instead?

```sql
-- Replace with your email
UPDATE user_profiles 
SET user_type = 'official', department = 'Public Works', employee_id = 'EMP-001'
WHERE email = 'your-email@example.com';
```

Then logout and login at `/official/login` with your credentials.

---

## 📝 Test Credentials

```
Email:    official@test.com
Password: Test@123456
URL:      http://localhost:5173/official/login
```

---

## ❓ Having Issues?

### "This portal is for authorized officials only"
Your account is not set as official. Run:
```sql
UPDATE user_profiles SET user_type = 'official' WHERE email = 'your-email@example.com';
```

### "Invalid credentials"
- Double-check email and password
- Reset password in Supabase Dashboard > Authentication > Users

### "User not found"
User doesn't exist in user_profiles. Create it:
```sql
INSERT INTO user_profiles (id, email, full_name, user_type, department, employee_id, is_onboarding_complete)
SELECT id, email, email, 'official', 'Public Works', 'EMP-001', true
FROM auth.users WHERE email = 'your-email@example.com';
```

---

## 📚 More Help

- **Detailed Guide**: `docs/OFFICIAL_ACCOUNT_SETUP_VISUAL_GUIDE.md`
- **SQL Script**: `docs/scripts/quick-create-official.sql`
- **Full Documentation**: `docs/OFFICIAL_PORTAL_GUIDE.md`

---

**That's it! You're ready to use the Official Portal! 🚀**
