# 🚀 Run This SQL Now - Fix Navigation

## Copy and Paste This Into Supabase SQL Editor

```sql
-- Add latitude and longitude columns to issues table
ALTER TABLE issues 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_issues_coordinates 
ON issues(latitude, longitude);
```

## That's It! ✅

After running the above:
- ✅ New issues will automatically save coordinates
- ✅ "Get Directions" button will work
- ✅ Navigation features fully functional

## How to Run

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "SQL Editor" (left sidebar)
4. Click "New Query"
5. Copy the SQL above
6. Paste it
7. Click "RUN" (or press Ctrl+Enter)
8. Wait for "Success" message

## Verify It Worked

Run this to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('latitude', 'longitude');
```

Should show:
```
latitude  | numeric
longitude | numeric
```

## Test It

1. Report a new issue in your app
2. Use "Pick on Map" or "Use Current Location"
3. Submit the issue
4. Open it in official portal
5. Click "GET DIRECTIONS IN GOOGLE MAPS"
6. Should open Google Maps with route! 🎉

## For Existing Issues (Optional)

If you have old issues with location in "lat, lng" format, run this:

```sql
UPDATE issues
SET 
  latitude = CAST(SPLIT_PART(location, ',', 1) AS DECIMAL),
  longitude = CAST(SPLIT_PART(location, ',', 2) AS DECIMAL)
WHERE 
  (latitude IS NULL OR longitude IS NULL)
  AND location ~ '^-?\d+\.?\d*,\s*-?\d+\.?\d*$';
```

## Troubleshooting

**Error: "column already exists"**
- ✅ Good! Columns were already added. Test the navigation feature.

**Error: "permission denied"**
- ✅ Make sure you're logged in as project owner

**Still showing "coordinates not available"**
- ✅ Make sure you're testing with a NEW issue (created after running the SQL)
- ✅ Old issues won't have coordinates unless you run the optional UPDATE above

## Done!

Navigation should now work perfectly for all new issues! 🗺️✨
