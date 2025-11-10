# Codebase Refactoring Plan

## Current Issues
- 50+ markdown files cluttering root directory
- Unclear folder structure
- Mixed documentation and code
- Test files in production code
- Duplicate/outdated documentation

## New Structure

```
civic-connect/
├── README.md                          # Main project documentation
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── .env.local
│
├── docs/                              # All documentation
│   ├── setup/                         # Setup guides
│   │   ├── DATABASE_SETUP.md
│   │   ├── GOOGLE_MAPS_SETUP.md
│   │   └── DEPLOYMENT.md
│   ├── features/                      # Feature documentation
│   │   ├── OFFICIAL_PORTAL.md
│   │   ├── CITIZEN_FEEDBACK.md
│   │   └── WORKER_ONBOARDING.md
│   └── migration/                     # Database migrations
│       └── *.sql
│
├── src/
│   ├── main.tsx                       # App entry point
│   ├── App.tsx                        # Main app component
│   │
│   ├── features/                      # Feature-based organization
│   │   ├── auth/                      # Authentication
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── issues/                    # Issue management
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── official/                  # Official portal
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   ├── profile/                   # User profiles
│   │   └── events/                    # Community events
│   │
│   ├── shared/                        # Shared resources
│   │   ├── components/                # Reusable components
│   │   │   ├── ui/                    # UI primitives
│   │   │   ├── layout/                # Layout components
│   │   │   └── common/                # Common components
│   │   ├── hooks/                     # Custom hooks
│   │   ├── utils/                     # Utility functions
│   │   ├── types/                     # TypeScript types
│   │   ├── constants/                 # Constants
│   │   └── lib/                       # Third-party configs
│   │
│   └── styles/                        # Global styles
│       └── index.css
│
└── public/                            # Static assets
    ├── images/
    └── icons/
```

## Actions

### 1. Clean Root Directory
- Move all .md files to docs/ (except README.md)
- Remove test scripts from root
- Keep only essential config files

### 2. Reorganize src/
- Create feature-based folders
- Move pages into respective features
- Consolidate shared components
- Separate UI primitives from business components

### 3. Update Imports
- Update all import paths
- Use path aliases (@/ for src/)
- Consistent import ordering

### 4. Documentation
- Create comprehensive README.md
- Consolidate setup guides
- Remove duplicate docs
- Keep migration scripts organized

## Benefits
- Clear separation of concerns
- Easy to find files
- Scalable structure
- Better developer experience
- Cleaner git history
