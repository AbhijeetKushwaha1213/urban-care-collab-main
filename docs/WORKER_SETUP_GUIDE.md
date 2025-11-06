# 🚀 Worker System Setup Guide

## Quick Start for Administrators

### 1. Database Setup

Run the migration script in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of docs/migration/worker-tables.sql
-- This creates all necessary tables, functions, and security policies
```

### 2. Create Worker Accounts

#### Method 1: Using the Admin Interface (Recommended)
```typescript
import WorkerAuthService from '@/services/workerAuthService';

// Create a new worker account
const workerData = {
  employee_id: 'EMP001',
  full_name: 'राज कुमार',
  phone_number: '+91-9876543210',
  department: 'Infrastructure',
  email: 'raj.kumar@municipality.gov',
  password: 'SecurePassword123!'
};

const result = await WorkerAuthService.createWorker(workerData);
```

#### Method 2: Direct Database Insert
```sql
-- First create user account
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('worker@municipality.gov', crypt('password123', gen_salt('bf')), NOW());

-- Then create user profile
INSERT INTO users (id, email, full_name, user_type, department, employee_id, phone_number)
VALUES (
  'user-uuid-from-auth-users',
  'worker@municipality.gov',
  'राज कुमार',
  'worker',
  'Infrastructure',
  'EMP001',
  '+91-9876543210'
);

-- Finally create worker record
INSERT INTO workers (employee_id, full_name, phone_number, department, user_id)
VALUES ('EMP001', 'राज कुमार', '+91-9876543210', 'Infrastructure', 'user-uuid-from-auth-users');
```

### 3. Test Worker Login

#### Employee ID Method:
- URL: `/worker/login`
- Employee ID: `EMP001`
- Password: `SecurePassword123!`

#### Phone OTP Method:
- URL: `/worker/login`
- Phone: `+91-9876543210`
- OTP: Check console logs (in development)

### 4. Assign Tasks to Workers

```sql
-- Assign an existing issue to a worker
SELECT assign_issue_to_worker(
  'issue-uuid-here',    -- Issue ID
  'worker-uuid-here',   -- Worker ID
  'authority-uuid-here' -- Assigned by (Authority)
);
```

### 5. Test Complete Workflow

1. **Create Test Issue** (as citizen)
2. **Assign to Worker** (as authority)
3. **Complete Task** (as worker)
4. **Review & Approve** (as authority)

## Sample Data for Testing

### Test Workers
```sql
-- Infrastructure Worker
INSERT INTO workers (employee_id, full_name, phone_number, department, user_id) VALUES
('EMP001', 'राज कुमार', '+91-9876543210', 'Infrastructure', 'user-uuid-1');

-- Electricity Worker  
INSERT INTO workers (employee_id, full_name, phone_number, department, user_id) VALUES
('EMP002', 'सुनीता शर्मा', '+91-9876543211', 'Electricity', 'user-uuid-2');

-- Water Department Worker
INSERT INTO workers (employee_id, full_name, phone_number, department, user_id) VALUES
('EMP003', 'अमित पटेल', '+91-9876543212', 'Water', 'user-uuid-3');
```

### Test Issues for Assignment
```sql
-- Sample issues that can be assigned to workers
INSERT INTO issues (title, description, location, category, status, created_by) VALUES
('Pothole on Main Street', 'Large pothole causing vehicle damage', '123 Main St, Sector 5', 'Infrastructure', 'reported', 'citizen-uuid'),
('Streetlight Not Working', 'Street light has been off for 3 days', '456 Oak Avenue', 'Electricity', 'reported', 'citizen-uuid'),
('Water Pipe Leak', 'Water leaking from main pipe', '789 Pine Road', 'Water', 'reported', 'citizen-uuid');
```

## Configuration

### Environment Variables
```bash
# Add to your .env.local file
VITE_WORKER_OTP_EXPIRY=300000          # 5 minutes
VITE_WORKER_SESSION_TIMEOUT=28800000   # 8 hours  
VITE_MAX_PHOTO_SIZE=10485760           # 10MB
VITE_WORKER_DEFAULT_DEPARTMENT=General
```

### SMS Integration (Production)
For production deployment, integrate with SMS service:

```typescript
// Replace the mock OTP service in workerAuthService.ts
static async sendOTP(phoneNumber: string) {
  // Integration with Twilio, AWS SNS, or local SMS gateway
  const response = await fetch('/api/sms/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber })
  });
  
  return response.json();
}
```

## Mobile App Deployment

### Progressive Web App (PWA)
The worker interface is optimized as a PWA:

1. **Add to Home Screen**: Workers can install the app
2. **Offline Support**: Basic functionality without internet
3. **Push Notifications**: Task assignments and updates
4. **Camera Integration**: Native photo capture

### Native App Options
For enhanced mobile experience:

1. **React Native**: Convert existing components
2. **Capacitor**: Wrap web app with native features
3. **Cordova**: Traditional hybrid app approach

## Security Checklist

- [ ] Database RLS policies enabled
- [ ] Worker accounts have limited permissions
- [ ] Photo uploads are validated and sanitized
- [ ] OTP expiration is properly configured
- [ ] Session timeouts are enforced
- [ ] HTTPS is enabled in production
- [ ] API rate limiting is configured

## Monitoring Setup

### Key Metrics to Track
- Worker login success/failure rates
- Task completion times
- Photo upload success rates
- App crash reports
- Battery usage statistics

### Logging Configuration
```typescript
// Add to your logging service
const workerMetrics = {
  loginAttempts: 0,
  taskCompletions: 0,
  photoUploads: 0,
  errors: []
};
```

## Troubleshooting

### Common Issues

#### "Worker not found" during login
- Check if worker record exists in database
- Verify employee_id matches exactly
- Ensure worker is marked as active

#### OTP not received
- Check phone number format (+91-XXXXXXXXXX)
- Verify SMS service configuration
- Check console logs for development OTP

#### Photos not uploading
- Check file size limits (10MB default)
- Verify image format (JPEG, PNG)
- Check network connectivity
- Review storage permissions

#### Maps not opening
- Verify device has maps app installed
- Check location permissions
- Test with different coordinate formats

### Debug Mode
Enable debug logging:
```typescript
localStorage.setItem('worker_debug', 'true');
```

## Support Resources

### Training Materials
- Worker onboarding video (create based on your municipality)
- Quick reference cards for common tasks
- Multilingual help documentation

### Contact Information
- IT Support: `it-support@municipality.gov`
- Supervisor Hotline: `+91-XXXXXXXXXX`
- Emergency Contact: `+91-XXXXXXXXXX`

## Next Steps

1. **Pilot Program**: Start with 5-10 workers in one department
2. **Feedback Collection**: Gather user experience feedback
3. **Iterative Improvement**: Refine based on field usage
4. **Full Rollout**: Deploy to all departments
5. **Advanced Features**: Add route optimization, inventory tracking

The worker system is now ready for deployment! 🎉