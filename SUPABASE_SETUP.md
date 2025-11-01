# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in and create a new project
3. Wait for the project to be set up

## 2. Get Your Project Credentials

1. Go to Settings > API
2. Copy your Project URL and anon public key
3. Update `src/lib/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'YOUR_PROJECT_URL'
const supabaseAnonKey = 'YOUR_ANON_KEY'
```

## 3. Set Up Database Tables

Run these SQL commands in the Supabase SQL Editor:

### User Profiles Table
```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  role TEXT,
  bio TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_onboarding_complete BOOLEAN DEFAULT FALSE
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Events Table
```sql
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  date TEXT,
  time TEXT,
  status TEXT DEFAULT 'Upcoming',
  time_remaining TEXT,
  categories TEXT[] DEFAULT '{}',
  volunteers_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view events
CREATE POLICY "Anyone can view events" ON events
  FOR SELECT USING (true);

-- Policy: Authenticated users can create events
CREATE POLICY "Authenticated users can create events" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Policy: Users can delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE USING (auth.uid() = created_by);
```

### Issues Table
```sql
CREATE TABLE issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  category TEXT,
  image TEXT,
  date TEXT,
  status TEXT DEFAULT 'reported',
  comments_count INTEGER DEFAULT 0,
  volunteers_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view issues
CREATE POLICY "Anyone can view issues" ON issues
  FOR SELECT USING (true);

-- Policy: Authenticated users can create issues
CREATE POLICY "Authenticated users can create issues" ON issues
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can update their own issues
CREATE POLICY "Users can update own issues" ON issues
  FOR UPDATE USING (auth.uid() = created_by);

-- Policy: Users can delete their own issues
CREATE POLICY "Users can delete own issues" ON issues
  FOR DELETE USING (auth.uid() = created_by);
```

## 4. Set Up Storage (Optional)

If you need file uploads:

1. Go to Storage in your Supabase dashboard
2. Create a new bucket (e.g., "uploads")
3. Set up storage policies as needed

## 5. Configure Authentication

1. Go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:5173` for development)
3. For Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

## 6. Environment Variables (Optional)

Create a `.env.local` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Then update `src/lib/supabase.ts`:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 7. Test Your Setup

After completing the setup, your app should be able to:
- Sign up/sign in users
- Create and manage events
- Create and manage issues
- Store user profiles

## Migration Notes

- Supabase uses PostgreSQL instead of Firestore's document model
- Authentication is handled differently but provides similar functionality
- File storage works similarly to Firebase Storage
- Real-time subscriptions are available if needed