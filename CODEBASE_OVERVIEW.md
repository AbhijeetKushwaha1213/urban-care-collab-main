# Nagar Setu - Codebase Overview

## 📊 Project Status: CLEAN & ORGANIZED ✅

This document provides a comprehensive overview of the codebase structure after cleanup and refactoring.

## 🎯 Quick Start

1. **New to the project?** → Read [README.md](README.md)
2. **Setting up database?** → Use [COMPLETE_DATABASE_SETUP.sql](COMPLETE_DATABASE_SETUP.sql)
3. **Deploying?** → Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
4. **Official Portal?** → See [docs/OFFICIAL_PORTAL_GUIDE.md](docs/OFFICIAL_PORTAL_GUIDE.md)

## 📁 Clean Directory Structure

```
nagar-setu/
│
├── 📄 README.md                           # Project overview
├── 📄 CODEBASE_OVERVIEW.md                # This file
├── 📄 COMPLETE_DATABASE_SETUP.sql         # Database setup script
├── 📄 CLEANUP_SUMMARY.md                  # Recent cleanup details
│
├── 📂 src/                                # Source code
│   ├── components/                        # React components
│   │   ├── ui/                           # Shadcn UI components
│   │   ├── AdminAccessCodeManager.tsx
│   │   ├── AssignWorkerModal.tsx
│   │   ├── AuthModal.tsx
│   │   ├── CitizenFeedbackModal.tsx
│   │   ├── CompactResolvedShowcase.tsx   # Landing page showcase
│   │   ├── DuplicateIssueModal.tsx
│   │   ├── EditProfileModal.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── IssueCard.tsx
│   │   ├── IssueDetailModal.tsx
│   │   ├── IssueMap.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LocationPermissionModal.tsx
│   │   ├── LocationPicker.tsx
│   │   ├── MediaUploadComponent.tsx      # Multi-media upload
│   │   ├── Navbar.tsx
│   │   ├── NotificationCenter.tsx
│   │   └── SimpleMap.tsx
│   │
│   ├── pages/                            # Page components
│   │   ├── official/                     # Official portal pages
│   │   │   ├── OfficialLogin.tsx
│   │   │   ├── OfficialOnboarding.tsx
│   │   │   ├── OfficialDashboard.tsx
│   │   │   ├── IssueDetails.tsx
│   │   │   ├── UploadResolution.tsx
│   │   │   └── OfficialProfile.tsx
│   │   │
│   │   ├── AuthCallback.tsx
│   │   ├── AuthorityDashboard.tsx
│   │   ├── EventDetail.tsx
│   │   ├── Events.tsx
│   │   ├── Index.tsx
│   │   ├── IssueDetail.tsx
│   │   ├── Issues.tsx
│   │   ├── Landing.tsx                   # Main landing page
│   │   ├── NotFound.tsx
│   │   ├── Profile.tsx
│   │   ├── ReportIssue.tsx               # Issue reporting with media
│   │   ├── UserHomepage.tsx
│   │   └── UserOnboarding.tsx
│   │
│   ├── contexts/                         # React contexts
│   │   ├── LocationContext.tsx
│   │   └── SupabaseAuthContext.tsx
│   │
│   ├── hooks/                            # Custom hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                              # Libraries & configs
│   │   ├── supabase.ts                   # Supabase client
│   │   └── utils.ts                      # Utility functions
│   │
│   ├── services/                         # API services
│   │   ├── authorityService.ts           # Authority operations
│   │   ├── duplicateDetectionService.ts  # Duplicate detection
│   │   ├── supabaseService.ts            # Supabase operations
│   │   └── visionService.ts              # Google Vision AI
│   │
│   ├── types/                            # TypeScript types
│   │   └── supabase.ts                   # Database types
│   │
│   ├── utils/                            # Utility functions
│   │   └── authValidation.ts             # Auth validation
│   │
│   ├── constants/                        # Constants
│   │   └── categories.ts                 # Issue categories
│   │
│   ├── App.tsx                           # Main app component
│   ├── main.tsx                          # Entry point
│   └── index.css                         # Global styles
│
├── 📂 docs/                              # Essential documentation
│   ├── ADMIN_APPROVAL_WORKFLOW.md        # Admin approval process
│   ├── CITIZEN_FEEDBACK_SYSTEM.md        # Feedback system
│   ├── CREATE_OFFICIAL_ACCOUNT_GUIDE.md  # Account creation
│   ├── DEPLOYMENT.md                     # Deployment guide
│   ├── DUPLICATE_DETECTION.md            # Duplicate detection
│   ├── FOLDER_STRUCTURE.md               # Folder organization
│   ├── OFFICIAL_ACCOUNT_SETUP_VISUAL_GUIDE.md
│   ├── OFFICIAL_PORTAL_DEPLOYMENT_CHECKLIST.md
│   ├── OFFICIAL_PORTAL_GUIDE.md          # Official portal docs
│   ├── OFFICIAL_PORTAL_QUICKSTART.md     # Quick start
│   ├── OFFICIAL_PORTAL_WORKFLOW.md       # Workflow guide
│   ├── PROJECT_STRUCTURE.md              # Project structure
│   ├── README.md                         # Docs overview
│   ├── VERCEL_OPTIMIZATION.md            # Optimization guide
│   └── WORKER_ONBOARDING_AND_ASSIGNMENT.md
│
├── 📂 public/                            # Static assets
│   ├── cityscape-bg.jpeg                 # Landing page background
│   ├── favicon.ico
│   ├── placeholder.svg
│   ├── robots.txt
│   └── _redirects                        # Vercel redirects
│
├── 📂 scripts/                           # Utility scripts
│   ├── deploy.sh                         # Deployment script
│   └── generate-access-code.js           # Access code generator
│
└── 📄 Configuration Files
    ├── package.json                      # Dependencies
    ├── tsconfig.json                     # TypeScript config
    ├── vite.config.ts                    # Vite config
    ├── tailwind.config.ts                # Tailwind config
    ├── vercel.json                       # Vercel config
    └── components.json                   # Shadcn config
```

## 🎨 Key Features

### 1. Landing Page
- **File**: `src/pages/Landing.tsx`
- **Features**:
  - Real-time statistics
  - User type selection (Citizen/Authority/Worker)
  - Compact resolved issues showcase
  - Responsive design

### 2. Issue Reporting
- **File**: `src/pages/ReportIssue.tsx`
- **Component**: `src/components/MediaUploadComponent.tsx`
- **Features**:
  - Multiple image upload (up to 5)
  - Video upload (up to 2)
  - Voice note recording (up to 3)
  - AI-powered description generation
  - Duplicate detection
  - Location picker with map

### 3. Resolved Issues Showcase
- **File**: `src/components/CompactResolvedShowcase.tsx`
- **Features**:
  - Grid layout (3 columns on desktop)
  - Interactive before/after sliders
  - Responsive design
  - Auto-fetches from database

### 4. Official Portal
- **Directory**: `src/pages/official/`
- **Features**:
  - Secure login with access codes
  - Issue assignment to workers
  - Resolution upload with before/after photos
  - Department-based access control

### 5. Authority Dashboard
- **File**: `src/pages/AuthorityDashboard.tsx`
- **Features**:
  - Issue overview and statistics
  - Issue management
  - Analytics and insights

## 🔧 Core Technologies

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Framer Motion** - Animations
- **React Router** - Routing
- **React Hook Form** - Form handling

### Backend & Services
- **Supabase** - Backend as a Service
  - Authentication
  - PostgreSQL database
  - Real-time subscriptions
  - Storage
- **Google Vision AI** - Image analysis
- **Google Maps API** - Location services

### State Management
- **React Context** - Global state
- **TanStack Query** - Server state
- **Local Storage** - Persistence

## 📊 Database Schema

### Main Tables
- `issues` - Civic issues
- `users` - User accounts
- `officials` - Official accounts
- `departments` - Government departments
- `access_codes` - Official access codes
- `issue_assignments` - Worker assignments
- `citizen_feedback` - User feedback
- `notifications` - User notifications

### Key Relationships
- Issues → Users (created_by)
- Issues → Officials (assigned_to)
- Officials → Departments (department_id)
- Assignments → Issues + Officials

## 🚀 Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Build
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Deploy
```bash
# Deploy to Vercel
./scripts/deploy.sh
```

## 📝 Code Organization

### Components
- **UI Components**: `src/components/ui/` - Reusable UI elements
- **Feature Components**: `src/components/` - Feature-specific components
- **Page Components**: `src/pages/` - Full page components

### Services
- **API Services**: `src/services/` - External API integrations
- **Supabase Service**: Centralized database operations
- **Vision Service**: Google Vision AI integration
- **Authority Service**: Official portal operations

### Contexts
- **Auth Context**: User authentication state
- **Location Context**: User location management

### Hooks
- **Custom Hooks**: `src/hooks/` - Reusable logic
- **Toast Hook**: Notification system
- **Mobile Hook**: Responsive utilities

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- Access code system for officials
- Protected routes with auth guards
- Session management

### Authorization
- Role-based access control (RBAC)
- Department-based permissions
- Row-level security (RLS) in database

### Data Protection
- Environment variables for secrets
- Secure API endpoints
- Input validation
- XSS protection

## 🎯 Best Practices

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Consistent naming conventions
- Component composition

### Performance
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

## 📚 Documentation

### Essential Docs
- **README.md** - Project overview
- **DEPLOYMENT.md** - Deployment guide
- **OFFICIAL_PORTAL_GUIDE.md** - Official portal documentation
- **CLEANUP_SUMMARY.md** - Recent cleanup details

### Feature Docs
All feature documentation is in the `docs/` directory, organized by topic.

## 🔄 Recent Changes

### Cleanup (November 2024)
- ✅ Removed 90+ unused files
- ✅ Deleted 7 archive directories
- ✅ Cleaned up root directory
- ✅ Removed duplicate components
- ✅ Deleted test files
- ✅ Organized documentation

### Features Added
- ✅ Compact resolved issues showcase
- ✅ Multi-media upload (images, video, audio)
- ✅ Interactive before/after sliders
- ✅ Real-time statistics on landing page

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Check TypeScript errors with `npm run type-check`
2. **Database Issues**: Verify Supabase connection in `.env.local`
3. **Map Issues**: Check Google Maps API key
4. **Auth Issues**: Clear browser cache and localStorage

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

## 📞 Support

For issues or questions:
1. Check existing documentation in `docs/`
2. Review `CLEANUP_SUMMARY.md` for recent changes
3. Check git history for context
4. Contact development team

---

**Last Updated**: November 2024
**Status**: ✅ Clean & Production Ready
**Version**: 2.0 (Post-Cleanup)
