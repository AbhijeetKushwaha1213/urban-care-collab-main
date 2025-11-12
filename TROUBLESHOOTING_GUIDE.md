# 🔧 Troubleshooting Guide

## Common Issues After Recent Updates

### Issue 1: Build Errors
If you're seeing build errors, try:

```bash
# Clear cache and rebuild
rm -rf node_modules dist .vite
npm install
npm run build
```

### Issue 2: Import Errors
If you see "Cannot find module" errors:

```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### Issue 3: TypeScript Errors
If you see TypeScript errors:

```bash
# Check for type errors
npm run type-check

# If errors persist, restart TypeScript server in your IDE
```

### Issue 4: Supabase Connection Errors
If you see database connection errors:

1. Check `.env.local` file exists
2. Verify Supabase credentials are correct
3. Check Supabase project is active

### Issue 5: Status Update Not Working
If status updates aren't working in worker portal:

1. Check you're logged in as a worker/official
2. Verify issue is assigned to you
3. Check browser console for errors
4. Verify database permissions

### Issue 6: Authority Dashboard Errors
If authority dashboard shows errors:

1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check browser console
4. Verify you're logged in as authority

## Quick Fixes

### Clear Everything and Restart
```bash
# Stop dev server (Ctrl+C)

# Clear all caches
rm -rf node_modules dist .vite

# Reinstall
npm install

# Rebuild
npm run build

# Start dev server
npm run dev
```

### Check for Errors
```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

### Verify Environment
```bash
# Check if .env.local exists
ls -la .env.local

# Should contain:
# VITE_SUPABASE_URL=your-url
# VITE_SUPABASE_ANON_KEY=your-key
# VITE_GOOGLE_MAPS_API_KEY=your-key
```

## Recent Changes

### Files Modified
1. `src/pages/official/IssueDetails.tsx` - Added status dropdown
2. `src/pages/AuthorityDashboard.tsx` - Removed status update
3. `src/components/IssueDetailModal.tsx` - Made status update optional
4. `src/components/ImageUploadComponent.tsx` - New image-only upload
5. `src/pages/ReportIssue.tsx` - Updated to use image-only upload
6. `src/pages/Landing.tsx` - Performance optimizations
7. `vite.config.ts` - Build optimizations
8. `vercel.json` - Deployment optimizations

### Files Deleted
1. `src/components/MediaUploadComponent.tsx` - Replaced with ImageUploadComponent
2. `src/components/HomepageSuccessStories.tsx` - Unused
3. `src/components/SuccessStoriesShowcase.tsx` - Replaced
4. `src/components/ResolvedIssuesShowcase.tsx` - Replaced

## Specific Error Messages

### "Cannot find module '@/components/MediaUploadComponent'"
**Solution**: This component was deleted. Use `ImageUploadComponent` instead.

### "updateIssueStatus is not defined"
**Solution**: This function was removed from AuthorityDashboard. Status updates are now in worker portal only.

### "onStatusUpdate is not a function"
**Solution**: This prop is now optional in IssueDetailModal. It's fine if not provided.

### "Failed to resolve import"
**Solution**: 
```bash
# Restart dev server
npm run dev
```

## Browser Console Errors

### Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Share the error message for specific help

### Common Console Errors

**"Supabase client not initialized"**
- Check .env.local file
- Verify Supabase credentials
- Restart dev server

**"Cannot read property 'status' of undefined"**
- Issue data not loaded yet
- Check loading states
- Verify database query

**"Permission denied"**
- Check user authentication
- Verify user role
- Check database RLS policies

## Database Issues

### Check Database Connection
```typescript
// Test in browser console
const { data, error } = await supabase.from('issues').select('*').limit(1);
console.log('Data:', data);
console.log('Error:', error);
```

### Verify Tables Exist
Required tables:
- `issues`
- `issue_internal_notes`
- `officials`
- `user_profiles`

### Check RLS Policies
Ensure proper Row Level Security policies are set up in Supabase.

## Performance Issues

### Slow Loading
If pages load slowly:

1. Check network tab in DevTools
2. Look for slow API calls
3. Verify image sizes are reasonable
4. Check Supabase region

### Build Size Too Large
If build is too large:

```bash
# Analyze bundle
npm run build
# Check dist/ folder size
du -sh dist
```

## Getting Help

### Information to Provide
When asking for help, include:

1. **Error Message**: Exact error text
2. **Browser Console**: Screenshot or text
3. **Page/Route**: Which page has the error
4. **User Role**: Citizen, Authority, or Worker
5. **Steps to Reproduce**: What you did before error

### Debug Mode
Enable debug mode:

```typescript
// Add to .env.local
VITE_DEBUG=true
```

## Contact & Support

If issues persist:
1. Check documentation in `docs/` folder
2. Review recent changes in git history
3. Check Supabase dashboard for errors
4. Review browser console for specific errors

---

**Last Updated**: November 2024
**Status**: Active troubleshooting guide
