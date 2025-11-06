# 🔧 Worker System Documentation

## Overview

The Worker System is a mobile-first application designed for municipal corporation field workers who handle ground-level issue resolution. It provides a simple, intuitive interface optimized for phone screens with multilingual support.

## Design Philosophy

- **Device**: Mobile-Only (optimized for phone screens)
- **Language**: Large fonts, simple icons, minimal text, translatable UI
- **Core Loop**: See Job → Go to Job → Do Job → Prove Job is Done
- **Simplicity**: Clean, task-focused interface without complex analytics

## System Architecture

### User Types
- **Worker**: Field workers with employee IDs who complete assigned tasks
- **Authority**: Supervisors who assign tasks and review completed work
- **Admin**: System administrators who manage worker accounts

### Authentication Methods
1. **Employee ID + Password**: Traditional login with assigned credentials
2. **Phone OTP**: SMS-based verification using registered phone number

## Page Structure

### 1. Worker Login (`/worker/login`)
**Purpose**: Secure authentication for field workers

**Features**:
- Dual authentication methods (Employee ID or Phone OTP)
- Mobile-optimized interface
- Multilingual support indicators
- Error handling and validation

**Authentication Flow**:
```
Employee ID Method:
1. Enter Employee ID + Password
2. System validates credentials
3. Redirect to dashboard

Phone OTP Method:
1. Enter registered phone number
2. System sends 6-digit OTP
3. Enter OTP for verification
4. Redirect to dashboard
```

### 2. Worker Dashboard (`/worker/dashboard`)
**Purpose**: Central hub for task management

**Layout**:
- **Header**: Worker name, employee ID, logout button
- **Stats Cards**: Pending (बकाया) and Completed (पूरा हुआ) counts
- **Task Tabs**: 
  - Pending Tasks (default view)
  - Completed Tasks (history)

**Task Card Information**:
- Large category icon (🚧 Pothole, 💡 Streetlight, etc.)
- Priority badge (🔴 CRITICAL, 🟠 HIGH)
- Task ID (Issue #P-1045)
- Task type and location
- Assignment timestamp

### 3. Task Details (`/worker/task/:taskId`)
**Purpose**: Complete task information and navigation

**Sections**:

#### Header
- Task category and priority
- Issue ID reference

#### Location & Map
- Full address display
- Interactive map with pin
- **Magic Button**: "➔ GET DIRECTIONS"
  - Opens device's default maps app
  - Pre-filled destination coordinates
  - Supports Google Maps, Apple Maps

#### Original Report Details
- Citizen's description
- Assignment timestamp
- "Before" photo from citizen report

#### Action Buttons
- **💬 ADD NOTE / REPORT PROBLEM**: For issues or special requirements
- **✅ MARK AS COMPLETED**: Proceeds to proof of work

### 4. Proof of Work (`/worker/task/:taskId/complete`)
**Purpose**: Document task completion with evidence

**Requirements**:
- **Mandatory**: "After" photo of completed work
- **Optional**: Final notes about work performed

**Photo Capture**:
- Camera integration for live capture
- Gallery selection option
- File validation (type, size)
- Preview and retake functionality

**Completion Flow**:
1. Take/upload "After" photo
2. Add optional completion notes
3. Submit for authority review
4. Update task status to "completed_by_worker"

## Technical Implementation

### Database Schema

#### Workers Table
```sql
CREATE TABLE workers (
    id UUID PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Worker Tasks Table
```sql
CREATE TABLE worker_tasks (
    id UUID PRIMARY KEY,
    issue_id UUID REFERENCES issues(id),
    worker_id UUID REFERENCES workers(id),
    assigned_by UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    worker_notes TEXT,
    before_image TEXT,
    after_image TEXT,
    assigned_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);
```

#### Updated Issue Statuses
- `reported` → `assigned` → `in_progress` → `completed_by_worker` → `pending_review` → `resolved`

### Authentication Service

#### WorkerAuthService Methods
- `loginWithEmployeeId()`: Employee ID + password authentication
- `sendOTP()`: SMS OTP generation and sending
- `verifyOTPAndLogin()`: OTP verification and session creation
- `getCurrentWorkerSession()`: Session management
- `logoutWorker()`: Session cleanup
- `createWorker()`: Admin function for worker account creation

### Mobile Optimization

#### Responsive Design
- Mobile-first CSS with large touch targets
- Optimized for 375px-414px screen widths
- High contrast colors for outdoor visibility
- Large fonts (minimum 16px) for readability

#### Performance
- Lazy loading for images
- Offline capability for basic functions
- Minimal JavaScript bundle size
- Fast navigation between screens

## Integration with Authority System

### Two-Step Verification Process

#### Worker Completion
1. Worker fixes the issue
2. Takes "After" photo as proof
3. Submits completion with optional notes
4. Status changes to `completed_by_worker`

#### Authority Review
1. Issue appears in "Pending Review" queue
2. Authority sees side-by-side comparison:
   - Left: Citizen's "Before" photo
   - Right: Worker's "After" photo
3. Authority approves or requests revision
4. Final status change to `resolved`
5. Citizen receives completion notification

### Workflow States
```
Issue Lifecycle:
reported → assigned → in_progress → completed_by_worker → pending_review → resolved

Worker Task States:
pending → in_progress → completed
```

## Multilingual Support

### Current Implementation
- English primary interface
- Hindi translations for key terms
- Expandable to regional languages

### Key Translations
- Pending / बकाया
- Completed / पूरा हुआ
- Instructions in Hindi for photo capture
- Error messages in local language

## Security Features

### Authentication Security
- Secure password hashing
- OTP expiration (5 minutes)
- Session token management
- Device-specific sessions

### Data Protection
- Row Level Security (RLS) policies
- Workers can only access assigned tasks
- Encrypted photo storage
- Audit trail for all actions

### Access Control
```sql
-- Workers can only see their own tasks
CREATE POLICY "Workers can view own tasks" ON worker_tasks
    FOR SELECT USING (
        worker_id IN (
            SELECT id FROM workers WHERE user_id = auth.uid()
        )
    );
```

## API Endpoints

### Worker Authentication
- `POST /api/worker/login` - Employee ID login
- `POST /api/worker/send-otp` - Send OTP to phone
- `POST /api/worker/verify-otp` - Verify OTP and login
- `POST /api/worker/logout` - End session

### Task Management
- `GET /api/worker/tasks` - Get assigned tasks
- `GET /api/worker/tasks/:id` - Get task details
- `PUT /api/worker/tasks/:id/start` - Mark task as started
- `PUT /api/worker/tasks/:id/complete` - Submit completion
- `POST /api/worker/tasks/:id/notes` - Add task notes

### File Upload
- `POST /api/worker/upload-photo` - Upload after photos
- `GET /api/worker/photos/:id` - Retrieve photos

## Testing & Quality Assurance

### Test Scenarios
1. **Authentication Flow**
   - Valid/invalid employee ID
   - OTP generation and verification
   - Session management

2. **Task Management**
   - Task list loading
   - Task detail navigation
   - Photo capture and upload
   - Completion submission

3. **Mobile Compatibility**
   - Various screen sizes
   - Touch interactions
   - Camera integration
   - Maps integration

### Performance Metrics
- Page load time < 2 seconds
- Photo upload < 10 seconds
- Offline functionality for 24 hours
- Battery optimization

## Deployment Considerations

### Environment Variables
```bash
# Worker system configuration
VITE_WORKER_OTP_EXPIRY=300000  # 5 minutes
VITE_WORKER_SESSION_TIMEOUT=28800000  # 8 hours
VITE_MAX_PHOTO_SIZE=10485760  # 10MB
```

### Database Migration
Run the provided SQL migration script:
```bash
# Execute in Supabase SQL Editor
docs/migration/worker-tables.sql
```

### Mobile App Considerations
- Progressive Web App (PWA) support
- App store deployment options
- Push notification setup
- Offline data synchronization

## Monitoring & Analytics

### Key Metrics
- Task completion rate
- Average completion time
- Photo upload success rate
- User session duration
- Error rates by function

### Logging
- Authentication attempts
- Task status changes
- Photo uploads
- Error occurrences
- Performance metrics

## Future Enhancements

### Planned Features
1. **Offline Mode**: Complete tasks without internet
2. **Voice Notes**: Audio recording for complex issues
3. **Barcode Scanning**: Equipment and material tracking
4. **Route Optimization**: Efficient task sequencing
5. **Real-time Chat**: Communication with supervisors
6. **Inventory Management**: Material usage tracking

### Scalability
- Multi-tenant support for different municipalities
- Bulk task assignment
- Advanced reporting and analytics
- Integration with existing municipal systems

## Support & Maintenance

### User Support
- In-app help system
- Emergency contact information
- Training materials and videos
- FAQ section

### System Maintenance
- Regular database cleanup
- Photo storage optimization
- Performance monitoring
- Security updates

This worker system provides a complete solution for municipal field work management, ensuring accountability, efficiency, and ease of use for ground-level workers.