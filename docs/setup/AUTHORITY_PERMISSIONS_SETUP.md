# Authority Permissions Setup

## Issue
Authorities were unable to update issue status due to missing database columns and insufficient RLS (Row Level Security) policies.

## Root Causes
1. **Missing Columns**: The `issues` table was missing `updated_at`, `assigned_to`, and `department` columns
2. **Missing User Type**: The `user_profiles` table was missing `user_type` and `department` columns  
3. **Insufficient RLS Policies**: Authorities couldn't update issues they didn't create due to restrictive policies

## Solution
Run the migration script to fix these issues:

### 1. Run Database Migration
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Open the SQL Editor (left sidebar)
4. Copy and paste the contents of `authority-permissions-migration.sql`
5. Click "Run" to execute the migration

### 2. What the Migration Does
- ✅ Adds missing columns (`updated_at`, `assigned_to`, `department`) to `issues` table
- ✅ Adds `user_type` and `department` columns to `user_profiles` table
- ✅ Creates automatic `updated_at` trigger for timestamp updates
- ✅ Adds RLS policies allowing authorities to update any issue status
- ✅ Creates performance indexes for better query speed

### 3. Code Fixes Applied
- ✅ Removed references to non-existent `updated_at` column in authority service
- ✅ Added better error handling and logging in status update function
- ✅ Added user type validation to warn if non-authority users access dashboard

## Testing
After running the migration:
1. Sign up as an authority user through the landing page
2. Access the authority dashboard
3. Try updating issue status - it should now work without errors
4. Check the browser console for any remaining error messages

## Verification
You can verify the migration worked by running this SQL query in Supabase:
```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('updated_at', 'assigned_to', 'department');

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'issues';
```