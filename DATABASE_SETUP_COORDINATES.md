# 🗺️ Database Setup for Coordinates & Navigation

## ⚠️ IMPORTANT: Run This First!

The navigation features require `latitude` and `longitude` columns in the `issues` table. Follow these steps to set up your database.

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Add Coordinate Columns

Copy and paste this SQL script:

```sql
-- Add latitude and longitude columns
ALTER TABLE issues 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add comments
COMMENT ON COLUMN issues.latitude IS 'Latitude coordinate for issue location';
COMMENT ON COLUMN issues.longitude IS 'Longitude coordinate for issue location';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_issues_coordinates ON issues(latitude, longitude);

-- Add validation constraints
ALTER TABLE issues 
ADD CONSTRAINT IF NOT EXISTS check_latitude_range 
CHECK (latitude IS NULL OR (latitude >= -90 AND latitude <= 90));

ALTER TABLE issues 
ADD CONSTRAINT IF NOT EXISTS check_longitude_range 
CHECK (longitude IS NULL OR (longitude >= -180 AND longitude <= 180));
```

Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)

### Step 3: Verify Columns Were Created

Run this query to verify:

```sql
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'issues' 
AND column_name IN ('latitude', 'longitude');
```

**Expected Output:**
```
column_name | data_type | is_nullable
------------|-----------|------------
latitude    | numeric   | YES
longitude   | numeric   | YES
```

### Step 4: Check Current Issues

See how many issues exist and how many have coordinates:

```sql
SELECT 
  COUNT(*) as total_issues,
  COUNT(latitude) as with_coordinates,
  COUNT(*) - COUNT(latitude) as missing_coordinates
FROM issues;
```

### Step 5: (Optional) Populate Existing Issues

If you have existing issues with location in "lat, lng" format, run this:

```sql
UPDATE issues
SET 
  latitude = CAST(SPLIT_PART(location, ',', 1) AS DECIMAL),
  longitude = CAST(SPLIT_PART(location, ',', 2) AS DECIMAL)
WHERE 
  (latitude IS NULL OR longitude IS NULL)
  AND location ~ '^-?\d+\.?\d*,\s*-?\d+\.?\d*$';
```

This will extract coordinates from location strings like "28.6139, 77.2090"

### Step 6: Verify Everything Works

Check a sample of issues:

```sql
SELECT 
  id,
  title,
  location,
  latitude,
  longitude
FROM issues
ORDER BY created_at DESC
LIMIT 5;
```

## ✅ Success Checklist

- [ ] Columns `latitude` and `longitude` exist in `issues` table
- [ ] Indexes are created
- [ ] Constraints are added
- [ ] Existing issues checked for coordinates
- [ ] Sample query shows correct data

## 🧪 Testing

### Test 1: Report a New Issue

1. Go to your app's "Report Issue" page
2. Click "Use Current Location" or "Pick on Map"
3. Fill in details and submit
4. Check database:
   ```sql
   SELECT latitude, longitude, location 
   FROM issues 
   ORDER BY created_at DESC 
   LIMIT 1;
   ```
5. Should see coordinates populated ✅

### Test 2: Navigation Feature

1. Open the issue in official portal
2. Click "GET DIRECTIONS IN GOOGLE MAPS"
3. Should open Google Maps with route ✅
4. Should NOT show "coordinates not available" error ✅

## 🐛 Troubleshooting

### Error: "column already exists"

**Solution:** This is fine! It means the columns were already added. Continue to next step.

### Error: "constraint already exists"

**Solution:** This is fine! The constraints were already added. Continue to next step.

### Error: "permission denied"

**Solution:** 
1. Make sure you're logged in as the project owner
2. Check your database permissions
3. Try running in Supabase SQL Editor (not external tool)

### Coordinates still NULL for new issues

**Check:**
1. Frontend code is updated (should be after this fix)
2. Browser console for errors
3. Network tab to see if data is being sent

**Debug Query:**
```sql
-- Check the most recent issue
SELECT 
  id,
  title,
  location,
  latitude,
  longitude,
  created_at,
  created_by
FROM issues
ORDER BY created_at DESC
LIMIT 1;
```

### "Get Directions" still not working

**Check:**
1. Issue has coordinates in database
2. Coordinates are not NULL
3. Coordinates are valid numbers
4. Browser console for JavaScript errors

**Debug:**
```sql
-- Check specific issue
SELECT latitude, longitude 
FROM issues 
WHERE id = 'your-issue-id';
```

If NULL, manually update:
```sql
UPDATE issues 
SET latitude = 28.6139, longitude = 77.2090 
WHERE id = 'your-issue-id';
```

## 📊 Monitoring Queries

### Check Coordinate Coverage

```sql
SELECT 
  COUNT(*) as total,
  COUNT(latitude) as with_coords,
  ROUND(COUNT(latitude)::DECIMAL / COUNT(*) * 100, 2) as percentage
FROM issues;
```

### Find Issues Without Coordinates

```sql
SELECT 
  id,
  title,
  location,
  created_at
FROM issues
WHERE latitude IS NULL OR longitude IS NULL
ORDER BY created_at DESC;
```

### Check Coordinate Validity

```sql
SELECT 
  id,
  title,
  latitude,
  longitude
FROM issues
WHERE 
  latitude IS NOT NULL 
  AND longitude IS NOT NULL
  AND (
    latitude < -90 OR latitude > 90 
    OR longitude < -180 OR longitude > 180
  );
```

Should return 0 rows (no invalid coordinates)

## 🔄 Rollback (If Needed)

If you need to remove the columns:

```sql
-- ⚠️ WARNING: This will delete all coordinate data!
ALTER TABLE issues 
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude;

-- Drop indexes
DROP INDEX IF EXISTS idx_issues_coordinates;
DROP INDEX IF EXISTS idx_issues_latitude;
DROP INDEX IF EXISTS idx_issues_longitude;
```

## 📚 Related Documentation

- Main migration script: `docs/migration/add-coordinates-columns.sql`
- Fix existing issues: `docs/migration/fix-missing-coordinates.sql`
- Navigation features: `docs/features/NAVIGATION_AND_DIRECTIONS.md`
- Complete fix guide: `COORDINATES_FIX_COMPLETE.md`

## 🎯 What's Next

After completing this setup:

1. ✅ New issues will automatically have coordinates
2. ✅ Navigation features will work
3. ✅ Workers can get directions to issue locations
4. ✅ Map features will display correctly

## 💡 Best Practices

### For Development
- Always use the location picker component
- Test with real GPS coordinates
- Verify coordinates before submission

### For Production
- Monitor coordinate coverage regularly
- Set up alerts for issues without coordinates
- Periodically geocode missing coordinates

### For Users
- Encourage use of "Use Current Location" button
- Provide clear instructions for location picker
- Show preview of selected location

## 🆘 Need Help?

If you encounter issues:

1. Check Supabase logs for errors
2. Verify database permissions
3. Test with a simple SELECT query first
4. Check browser console for frontend errors
5. Review the migration scripts in `docs/migration/`

## ✨ Summary

**Before:** Issues had no coordinates → Navigation didn't work
**After:** Issues have coordinates → Navigation works perfectly!

Run the migration script above, and you're all set! 🚀

---

**Status**: Ready to run
**Priority**: HIGH - Required for navigation features
**Estimated Time**: 2-3 minutes
**Risk Level**: LOW - Safe to run, uses IF NOT EXISTS
