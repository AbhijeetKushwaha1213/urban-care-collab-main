# Official Portal Guide

The Official Portal is a dedicated interface for municipal workers to manage and resolve reported issues.

## Overview

Municipal workers (officials) have access to a specialized portal where they can:
- View issues assigned to their department
- Update issue status
- Upload resolution photos
- Manage their worker profile
- Track department metrics

## Access

### URL
`/official/login` - Official portal login page

### Authentication
Officials must have:
- A verified account with `role = 'official'` in the profiles table
- Department assignment
- Employee ID

## Features

### 1. Official Login

**Path**: `/official/login`

Features:
- Separate login page for officials
- Email/password authentication
- Access code verification (optional)
- Redirect to onboarding if first-time user

### 2. Worker Onboarding

**Path**: `/official/onboarding`

First-time officials must complete their profile:
- Select department
- Enter employee ID
- Provide phone number
- Enter address

**Demo Mode**: Skip onboarding to see all issues (for testing)

### 3. Official Dashboard

**Path**: `/official/dashboard`

#### Metrics Cards
- Total Issues (assigned to department)
- Pending Issues
- In Progress Issues
- Resolved Issues

#### Issue List
- Filtered by department
- Status-based filtering
- Search functionality
- Real-time updates

#### Quick Actions
- View issue details
- Update status
- Upload resolution photos
- Navigate to profile

### 4. Issue Details

**Path**: `/official/issue/:id`

View comprehensive issue information:
- Issue title and description
- Reporter information
- Location (map view)
- Before photo
- Current status
- Assignment details

Actions available:
- Update status (pending → in_progress → resolved)
- Upload after photo
- Add resolution notes
- Mark as resolved

### 5. Upload Resolution

**Path**: `/official/upload-resolution/:id`

Upload after photos directly from issue details:
- Camera capture or file upload
- Preview before upload
- Automatic status update to "resolved"
- Stores in separate `after_image` column

### 6. Official Profile

**Path**: `/official/profile`

View and edit worker information:
- Full name
- Email
- Department
- Employee ID
- Phone number
- Address
- Profile photo

## User Flow

### First-Time Official

```
1. Navigate to /official/login
2. Sign in with credentials
3. Redirected to /official/onboarding
4. Complete profile information
5. Redirected to /official/dashboard
6. View assigned issues
```

### Returning Official

```
1. Navigate to /official/login
2. Sign in with credentials
3. Redirected to /official/dashboard
4. View and manage issues
```

### Resolving an Issue

```
1. From dashboard, click on an issue
2. Review issue details
3. Click "Start Working" (status → in_progress)
4. Work on resolving the issue
5. Click "Upload After Photo"
6. Take/upload resolution photo
7. Submit (status → resolved)
8. Citizen receives notification
```

## Status Workflow

```
pending → assigned → in_progress → resolved → closed
```

- **pending**: Newly reported, not assigned
- **assigned**: Assigned to department/worker
- **in_progress**: Worker is actively working on it
- **resolved**: Worker has completed resolution
- **closed**: Citizen confirmed satisfaction

## Department Structure

Supported departments:
- Roads & Transportation
- Water Supply
- Electricity
- Sanitation
- Parks & Recreation
- Public Safety
- Building & Construction
- Other

## Permissions

### What Officials Can Do
- View issues in their department
- Update status of assigned issues
- Upload resolution photos
- Edit their own profile

### What Officials Cannot Do
- View issues from other departments (unless admin)
- Delete issues
- Assign issues to others
- Access admin dashboard
- Modify other users' profiles

## Real-time Features

The official portal includes real-time updates:
- New issue assignments appear instantly
- Status changes reflect immediately
- Dashboard metrics update in real-time
- Notifications for citizen feedback

## Mobile Responsiveness

The official portal is fully responsive:
- Works on tablets and phones
- Touch-friendly interface
- Optimized for field work
- Camera integration for photos

## Best Practices

### For Workers
1. **Update status promptly**: Keep citizens informed
2. **Upload quality photos**: Show before/after clearly
3. **Add resolution notes**: Document what was done
4. **Check dashboard daily**: Stay on top of assignments
5. **Complete profile**: Helps with accountability

### For Administrators
1. **Assign issues quickly**: Don't let them pile up
2. **Balance workload**: Distribute evenly across workers
3. **Monitor metrics**: Track department performance
4. **Respond to feedback**: Address citizen concerns
5. **Train workers**: Ensure they know how to use the portal

## Troubleshooting

### Can't access official portal
- Verify role is set to 'official' in database
- Check if department is assigned
- Ensure account is verified

### Issues not showing
- Verify department assignment matches
- Check if issues are actually assigned to your department
- Try refreshing the page
- Check browser console for errors

### Can't upload photos
- Check file size (max 5MB)
- Verify file format (JPG, PNG)
- Ensure stable internet connection
- Check Supabase storage permissions

### Status not updating
- Verify you have permission to update
- Check if issue is assigned to you
- Ensure you're not offline
- Check for database errors

## API Endpoints

The official portal uses these Supabase queries:

### Get Department Issues
```typescript
const { data } = await supabase
  .from('issues')
  .select('*')
  .eq('department', userDepartment)
  .order('created_at', { ascending: false });
```

### Update Issue Status
```typescript
const { error } = await supabase
  .from('issues')
  .update({ status: 'in_progress' })
  .eq('id', issueId);
```

### Upload After Image
```typescript
const { data, error } = await supabase.storage
  .from('issue-images')
  .upload(`after-${issueId}.jpg`, file);
```

## Database Schema

### profiles table (official fields)
```sql
- role: 'official'
- department: VARCHAR
- employee_id: VARCHAR
- phone: VARCHAR
- address: TEXT
```

### issues table (official-related fields)
```sql
- assigned_to: UUID (references profiles.id)
- department: VARCHAR
- status: VARCHAR
- after_image: TEXT
- resolved_at: TIMESTAMP
```

## Future Enhancements

Planned features:
- [ ] Push notifications for new assignments
- [ ] Offline mode for field work
- [ ] Bulk status updates
- [ ] Performance analytics
- [ ] Worker leaderboard
- [ ] Issue templates
- [ ] Voice notes
- [ ] Route optimization for field visits

## Related Documentation

- [Worker Onboarding](WORKER_ONBOARDING.md)
- [Citizen Feedback System](CITIZEN_FEEDBACK.md)
- [Database Setup](../setup/DATABASE_SETUP.md)
