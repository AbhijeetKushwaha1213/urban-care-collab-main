# Civic Connect - Codebase Overview

## 📊 Project Status: REFACTORED & ORGANIZED ✅

This document provides a quick overview of the entire codebase structure and how to navigate it.

## 🎯 Quick Start

1. **New to the project?** → Read [README.md](README.md)
2. **Setting up?** → Follow [docs/setup/DATABASE_SETUP.md](docs/setup/DATABASE_SETUP.md)
3. **Deploying?** → Check [docs/setup/DEPLOYMENT.md](docs/setup/DEPLOYMENT.md)
4. **Understanding code structure?** → See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

## 📁 Directory Structure

```
civic-connect/
│
├── 📄 README.md                      # Start here!
├── 📄 REFACTORING_PLAN.md            # Refactoring strategy
├── 📄 REFACTORING_COMPLETE.md        # What was done
├── 📄 CODEBASE_OVERVIEW.md           # This file
│
├── 📂 src/                           # Source code
│   ├── components/                   # React components
│   ├── pages/                        # Page components
│   ├── contexts/                     # React contexts
│   ├── hooks/                        # Custom hooks
│   ├── lib/                          # Libraries & configs
│   ├── services/                     # API services
│   ├── types/                        # TypeScript types
│   ├── utils/                        # Utility functions
│   ├── constants/                    # Constants
│   ├── App.tsx                       # Main app
│   └── main.tsx                      # Entry point
│
├── 📂 docs/                          # Documentation
│   ├── setup/                        # Setup guides
│   │   ├── DATABASE_SETUP.md         # Database configuration
│   │   ├── GOOGLE_MAPS_SETUP.md      # Maps API setup
│   │   └── DEPLOYMENT.md             # Deployment guide
│   │
│   ├── features/                     # Feature docs
│   │   ├── OFFICIAL_PORTAL.md        # Official portal guide
│   │   ├── AI_POWERED_ISSUE_REPORTING.md
│   │   ├── ASSIGNMENT_SYSTEM.md
│   │   └── ENHANCED_PHOTO_UPLOAD.md
│   │
│   ├── migration/                    # Database migrations
│   │   ├── database-setup.sql
│   │   ├── department-official-portal.sql
│   │   ├── add-worker-profile-fields.sql
│   │   ├── add-citizen-feedback.sql
│   │   └── [more migrations...]
│   │
│   ├── scripts/                      # Utility scripts
│   │   ├── create-official-user.sql
│   │   └── quick-create-official.sql
│   │
│   ├── archive/                      # Old documentation
│   │   └── [50+ archived files]
│   │
│   ├── PROJECT_STRUCTURE.md          # Code organization
│   └── README.md                     # Docs index
│
├── 📂 public/                        # Static assets
│   ├── images/
│   ├── icons/
│   └── [other assets]
│
└── 📂 [config files]                 # Configuration
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── .env.local
```

## 🎨 Application Structure

### User Roles
1. **Citizens** - Report and track issues
2. **Officials/Workers** - Manage and resolve issues
3. **Administrators** - Oversee entire system

### Main Features

#### For Citizens
- 🏠 **Homepage** (`/`) - Landing page
- 📝 **Report Issue** (`/report`) - Submit new issues
- 📋 **Issues List** (`/issues`) - Browse all issues
- 🔍 **Issue Details** (`/issue/:id`) - View specific issue
- 👤 **Profile** (`/profile`) - User profile
- 🎉 **Events** (`/events`) - Community events

#### For Officials
- 🔐 **Official Login** (`/official/login`) - Dedicated login
- 📊 **Dashboard** (`/official/dashboard`) - Issue management
- 📸 **Upload Resolution** (`/official/upload-resolution/:id`) - Photo upload
- 👤 **Official Profile** (`/official/profile`) - Worker profile
- 🎓 **Onboarding** (`/official/onboarding`) - First-time setup

#### For Administrators
- 🎛️ **Authority Dashboard** (`/authority`) - Admin panel
- 👥 **Worker Assignment** - Assign issues to workers
- 🔔 **Notifications** - System alerts
- 📈 **Analytics** - Performance metrics

## 🗄️ Database Schema

### Core Tables
- **profiles** - User information and roles
- **issues** - Reported municipal issues
- **notifications** - System notifications
- **events** - Community events
- **success_stories** - Resolved issue showcases

### Key Relationships
```
profiles (1) ----< (many) issues
profiles (1) ----< (many) notifications
issues (1) ----< (many) comments
issues (1) ----< (1) success_stories
```

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Router** - Routing
- **React Query** - Data fetching

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Storage
  - Realtime subscriptions

### APIs & Services
- **Google Maps API** - Location services
- **Google Cloud Vision** - Image analysis (optional)

### Deployment
- **Vercel** - Hosting platform
- **GitHub** - Version control

## 📝 Key Files

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `tailwind.config.ts` - Tailwind configuration
- `.env.local` - Environment variables

### Entry Points
- `src/main.tsx` - Application entry
- `src/App.tsx` - Main app component
- `index.html` - HTML template

### Core Services
- `src/lib/supabase.ts` - Supabase client
- `src/contexts/SupabaseAuthContext.tsx` - Auth context
- `src/contexts/LocationContext.tsx` - Location context

## 🚀 Common Tasks

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

### Database
```bash
# Run migrations in Supabase SQL Editor
# Files located in docs/migration/
```

### Deployment
```bash
git push origin main  # Auto-deploys to Vercel
```

## 📚 Documentation Index

### Setup Guides
- [Database Setup](docs/setup/DATABASE_SETUP.md)
- [Google Maps Setup](docs/setup/GOOGLE_MAPS_SETUP.md)
- [Deployment Guide](docs/setup/DEPLOYMENT.md)
- [Supabase Setup](docs/setup/SUPABASE_SETUP.md)

### Feature Documentation
- [Official Portal](docs/features/OFFICIAL_PORTAL.md)
- [AI-Powered Reporting](docs/features/AI_POWERED_ISSUE_REPORTING.md)
- [Assignment System](docs/features/ASSIGNMENT_SYSTEM.md)
- [Photo Upload](docs/features/ENHANCED_PHOTO_UPLOAD.md)

### Code Documentation
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Folder Structure](docs/FOLDER_STRUCTURE.md)

### Workflow Documentation
- [Admin Approval](docs/ADMIN_APPROVAL_WORKFLOW.md)
- [Official Portal Workflow](docs/OFFICIAL_PORTAL_WORKFLOW.md)
- [Worker Onboarding](docs/WORKER_ONBOARDING_AND_ASSIGNMENT.md)

## 🔍 Finding Things

### "Where is...?"

**Authentication code?**
→ `src/contexts/SupabaseAuthContext.tsx`

**Issue components?**
→ `src/components/IssueCard.tsx`, `IssueMap.tsx`, etc.

**Official portal pages?**
→ `src/pages/official/`

**Database migrations?**
→ `docs/migration/`

**API services?**
→ `src/services/`

**UI components?**
→ `src/components/ui/`

**Type definitions?**
→ `src/types/index.ts`

**Utility functions?**
→ `src/utils/`

## 🐛 Troubleshooting

### Common Issues

**Build fails?**
→ Check `package.json` dependencies

**Database errors?**
→ Verify `.env.local` credentials

**Map not loading?**
→ Check Google Maps API key

**Auth not working?**
→ Check Supabase configuration

**Images not uploading?**
→ Check Supabase storage setup

### Getting Help

1. Check [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)
2. Review feature-specific docs in `docs/features/`
3. Check archived docs in `docs/archive/` for historical context
4. Open an issue on GitHub

## 📊 Project Statistics

- **Total Files**: ~200+
- **Components**: 30+
- **Pages**: 15+
- **Database Tables**: 5 core tables
- **API Endpoints**: Supabase auto-generated
- **Documentation Files**: 100+
- **Lines of Code**: ~10,000+

## 🎯 Next Steps

### For New Developers
1. ✅ Read README.md
2. ✅ Set up development environment
3. ✅ Run the app locally
4. ✅ Explore the codebase
5. ✅ Read feature documentation
6. ✅ Make your first contribution

### For Existing Developers
1. ✅ Review refactored structure
2. ✅ Update bookmarks to new docs
3. ✅ Follow new conventions
4. ✅ Migrate code gradually (optional)

### For Deployment
1. ✅ Follow deployment guide
2. ✅ Set up environment variables
3. ✅ Configure domain
4. ✅ Monitor performance

## 🤝 Contributing

See [README.md](README.md) for contribution guidelines.

## 📄 License

MIT License - See LICENSE file for details.

---

**Last Updated**: November 2024
**Maintained By**: Development Team
**Status**: Active Development

For questions or support, please open an issue on GitHub.
