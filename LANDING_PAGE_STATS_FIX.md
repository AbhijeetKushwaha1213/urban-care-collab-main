# Landing Page Statistics Fix

## Problem
Live statistics on the landing page showing no values (blank or 0).

## Solution Implemented

### 1. Enhanced Error Logging
Added detailed console logging to help debug the issue:
- Logs when fetching starts
- Logs each count as it's retrieved
- Logs detailed error information if something fails
- Shows success message when complete

### 2. Improved Error Handling
- Better error messages in console
- User-friendly toast notification if stats fail to load
- Graceful fallback to showing "0" instead of blank

### 3. Fixed Display Logic
- Shows "0" explicitly when there are no issues
- Prevents blank display
- Maintains loading animation while fetching

## How to Debug

### Step 1: Check Browser Console

Open your browser's developer console (F12) and look for:

**Success messages:**
```
Fetching landing page statistics...
Total issues count: 5
Resolved issues count: 2
Active citizens count: 3
✅ Statistics updated successfully
```

**Error messages:**
```
❌ Error fetching stats: [error details]
Error details: { message, code, hint }
```

### Step 2: Common Issues & Solutions

#### Issue: "relation 'issues' does not exist"
**Cause:** Database table not created
**Solution:**
```sql
-- Check if table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'issues';

-- If not exists, run your database setup migration
```

#### Issue: "permission denied for table issues"
**Cause:** Row Level Security (RLS) blocking anonymous access
**Solution:**
```sql
-- Allow public read access to issues for statistics
CREATE POLICY "Allow public read access for statistics" 
ON issues FOR SELECT 
USING (true);
```

#### Issue: Statistics show 0 but issues exist
**Cause:** RLS policies blocking the query
**Solution:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'issues';

-- Temporarily disable RLS for testing (NOT for production!)
ALTER TABLE issues DISABLE ROW LEVEL SECURITY;

-- Or create proper policy:
CREATE POLICY "Allow anonymous read for stats" 
ON issues FOR SELECT 
TO anon
USING (true);
```

#### Issue: "created_by" column doesn't exist
**Cause:** Database schema mismatch
**Solution:**
```sql
-- Check columns
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'issues';

-- Add missing column if needed
ALTER TABLE issues ADD COLUMN IF NOT EXISTS created_by UUID;
```

### Step 3: Test the Statistics

#### Manual Test Query
Run this in Supabase SQL Editor:

```sql
-- Test total count
SELECT COUNT(*) as total_issues FROM issues;

-- Test resolved count
SELECT COUNT(*) as resolved_issues 
FROM issues 
WHERE status = 'resolved';

-- Test unique citizens
SELECT COUNT(DISTINCT created_by) as active_citizens 
FROM issues 
WHERE created_by IS NOT NULL;
```

If these queries work in SQL Editor but not in the app, it's an RLS issue.

### Step 4: Fix RLS Policies

Create proper policies for public statistics access:

```sql
-- Drop existing policies if needed
DROP POLICY IF EXISTS "Allow public read access for statistics" ON issues;

-- Create new policy for anonymous users
CREATE POLICY "Public can view issues for statistics"
ON issues
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify RLS is enabled
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
```

## Quick Fix Script

Run this in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "public_read_issues" ON issues;

-- Create new policy for public read access
CREATE POLICY "public_read_issues"
ON issues
FOR SELECT
TO anon, authenticated
USING (true);

-- Verify it works
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved,
  COUNT(DISTINCT created_by) as citizens
FROM issues;
```

## Testing Checklist

- [ ] Open landing page
- [ ] Open browser console (F12)
- [ ] Look for "Fetching landing page statistics..." message
- [ ] Check if counts are logged
- [ ] Verify numbers appear on page
- [ ] Wait 30 seconds to see if auto-refresh works
- [ ] Create a new issue and see if stats update

## Expected Behavior

### On Page Load:
1. Shows loading animation (pulsing boxes)
2. Fetches statistics from database
3. Displays numbers with animations
4. Shows "Live Statistics" indicator

### Real-time Updates:
- Stats refresh every 30 seconds automatically
- Stats update when issues table changes
- Green pulsing dot indicates live connection

### If No Data:
- Shows "0" for all statistics
- No error messages to user
- Console shows successful fetch with 0 results

## Monitoring

### Check Statistics Health

```sql
-- Get current statistics
SELECT 
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_issues,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(DISTINCT created_by) as unique_citizens,
  MIN(created_at) as first_issue,
  MAX(created_at) as latest_issue
FROM issues;
```

### Check RLS Policies

```sql
-- List all policies on issues table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'issues';
```

## Performance Optimization

If you have many issues (1000+), consider:

### 1. Add Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_created_by ON issues(created_by);
```

### 2. Use Materialized View
```sql
CREATE MATERIALIZED VIEW landing_stats AS
SELECT 
  COUNT(*) as total_issues,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_issues,
  COUNT(DISTINCT created_by) as active_citizens
FROM issues;

-- Refresh periodically
REFRESH MATERIALIZED VIEW landing_stats;
```

### 3. Cache in Application
The component already caches for 30 seconds, but you can adjust:
```typescript
// Change refresh interval (in milliseconds)
const interval = setInterval(fetchStats, 60000); // 60 seconds
```

## Troubleshooting Commands

### Check Supabase Connection
```typescript
// In browser console
const { data, error } = await supabase.from('issues').select('count');
console.log('Connection test:', { data, error });
```

### Check RLS Impact
```typescript
// Test with service role (bypasses RLS)
const { count } = await supabase
  .from('issues')
  .select('*', { count: 'exact', head: true });
console.log('Count:', count);
```

### Force Refresh
```typescript
// In browser console
window.location.reload();
```

## Summary

**What was fixed:**
- ✅ Added detailed error logging
- ✅ Improved error handling
- ✅ Fixed display to show "0" instead of blank
- ✅ Added user-friendly error messages

**Most common cause:**
- RLS policies blocking anonymous access to issues table

**Quick fix:**
- Run the RLS policy script above in Supabase

**How to verify:**
- Check browser console for logs
- Run test queries in Supabase
- Verify statistics appear on landing page

---

**Status**: Fixed with enhanced debugging
**Next Step**: Check browser console and run RLS fix if needed
