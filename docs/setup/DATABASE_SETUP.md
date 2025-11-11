# Database Setup Guide

This guide will help you set up the Supabase database for Civic Connect.

## Prerequisites

- Supabase account (free tier works fine)
- Access to Supabase SQL Editor

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Name: Nagar-setu
   - Database Password: (save this securely)
   - Region: Choose closest to your users
4. Wait for project to be created (~2 minutes)

## Step 2: Get Your Credentials

1. Go to Project Settings > API
2. Copy these values to your `.env.local`:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`

## Step 3: Run Migration Scripts

Navigate to SQL Editor in your Supabase dashboard and run these scripts in order:

### 1. Core Tables Migration
```sql
-- Run: docs/migration/database-setup.sql
```

### 2. Official Portal Tables
```sql
-- Run: docs/migration/department-official-portal.sql
```

### 3. Worker Profile Fields
```sql
-- Run: docs/migration/add-worker-profile-fields.sql
```

### 4. Citizen Feedback System
```sql
-- Run: docs/migration/add-citizen-feedback.sql
```

### 5. Notifications Table
```sql
-- Run: docs/migration/create-notifications-table.sql
```

### 6. After Image Column
```sql
-- Run: docs/migration/ensure-after-image-column.sql
```

## Step 4: Set Up Storage

1. Go to Storage in Supabase dashboard
2. Create a new bucket called `issue-images`
3. Set bucket to public
4. Configure CORS if needed

## Step 5: Enable Realtime

1. Go to Database > Replication
2. Enable realtime for these tables:
   - `issues`
   - `notifications`
   - `profiles`

## Step 6: Set Up Row Level Security (RLS)

The migration scripts include RLS policies, but verify:

1. Go to Authentication > Policies
2. Ensure policies are enabled for:
   - `issues` table
   - `profiles` table
   - `notifications` table

## Verification

Test your setup:

1. Start your dev server: `npm run dev`
2. Try to sign up a new user
3. Try to create an issue
4. Check if data appears in Supabase dashboard

## Troubleshooting

### Can't connect to database
- Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Check if project is paused (free tier pauses after inactivity)

### RLS errors
- Ensure RLS policies are properly set up
- Check if user is authenticated
- Verify policy conditions match your use case

### Storage errors
- Ensure bucket is created and public
- Check storage policies
- Verify file size limits

## Database Schema

### Main Tables

- **profiles**: User profiles and roles
- **issues**: Reported municipal issues
- **notifications**: System notifications
- **events**: Community events
- **success_stories**: Resolved issue showcases

### Key Columns

#### issues table
- `id`: UUID primary key
- `title`: Issue title
- `description`: Detailed description
- `category`: Issue category
- `status`: pending/assigned/in_progress/resolved/closed
- `location`: Address string
- `latitude`, `longitude`: GPS coordinates
- `image`: Before photo URL
- `after_image`: After photo URL
- `created_by`: User ID
- `assigned_to`: Worker ID
- `department`: Department name
- `citizen_feedback`: satisfied/not_satisfied
- `citizen_feedback_comment`: Feedback text

#### profiles table
- `id`: UUID (matches auth.users.id)
- `email`: User email
- `full_name`: Display name
- `role`: citizen/official/admin
- `department`: For officials
- `employee_id`: For officials
- `phone`: Contact number
- `address`: User address

## Next Steps

- [Google Maps Setup](GOOGLE_MAPS_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Official Portal Setup](../features/OFFICIAL_PORTAL.md)
