# Quick Reference Guide

A cheat sheet for common tasks and locations in the Civic Connect codebase.

## 🚀 Quick Commands

```bash
# Development
npm install                    # Install dependencies
npm run dev                    # Start dev server (localhost:5173)
npm run build                  # Build for production
npm run preview                # Preview production build
npm run lint                   # Run ESLint
npm run type-check             # TypeScript type checking

# Git
git status                     # Check status
git add .                      # Stage all changes
git commit -m "message"        # Commit changes
git push origin main           # Push to main branch
```

## 📁 File Locations

### Configuration Files
```
.env.local                     # Environment variables
package.json                   # Dependencies & scripts
tsconfig.json                  # TypeScript config
vite.config.ts                 # Vite config
tailwind.config.ts             # Tailwind config
```

### Core Application Files
```
src/main.tsx                   # App entry point
src/App.tsx                    # Main app component
src/index.css                  # Global styles
```

### Authentication
```
src/contexts/SupabaseAuthContext.tsx    # Auth context
src/components/AuthModal.tsx            # Login/signup modal
src/pages/AuthCallback.tsx              # OAuth callback
```

### Issue Management
```
src/pages/ReportIssue.tsx              # Report new issue
src/pages/Issues.tsx                   # Issues list
src/pages/IssueDetail.tsx              # Issue details
src/components/IssueCard.tsx           # Issue card component
src/components/IssueMap.tsx            # Map view
```

### Official Portal
```
src/pages/official/OfficialLogin.tsx        # Official login
src/pages/official/OfficialDashboard.tsx    # Dashboard
src/pages/official/IssueDetails.tsx         # Issue details
src/pages/official/UploadResolution.tsx     # Photo upload
src/pages/official/OfficialProfile.tsx      # Profile
src/pages/official/OfficialOnboarding.tsx   # Onboarding
```

### Components
```
src/components/ui/                     # UI primitives (shadcn)
src/components/Navbar.tsx              # Navigation bar
src/components/LoadingSpinner.tsx      # Loading indicator
src/components/ErrorBoundary.tsx       # Error handling
```

### Services
```
src/lib/supabase.ts                    # Supabase client
src/services/supabaseService.ts        # Database operations
src/services/visionService.ts          # Google Vision API
src/services/duplicateDetectionService.ts  # Duplicate detection
```

### Types
```
src/types/index.ts                     # Main type definitions
src/types/google-maps.d.ts             # Google Maps types
```

### Documentation
```
README.md                              # Project overview
docs/setup/DATABASE_SETUP.md           # Database setup
docs/setup/GOOGLE_MAPS_SETUP.md        # Maps setup
docs/setup/DEPLOYMENT.md               # Deployment guide
docs/features/OFFICIAL_PORTAL.md       # Official portal guide
docs/PROJECT_STRUCTURE.md              # Code organization
```

## 🔑 Environment Variables

```env
# Required
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_GOOGLE_MAPS_API_KEY=AIzaSyxxx...

# Optional
VITE_GOOGLE_CLOUD_VISION_API_KEY=AIzaSyxxx...
```

## 🗄️ Database Tables

```sql
profiles              # User profiles
  - id (UUID)
  - email
  - full_name
  - role (citizen/official/admin)
  - department
  - employee_id

issues                # Reported issues
  - id (UUID)
  - title
  - description
  - category
  - status
  - location
  - latitude, longitude
  - image (before photo)
  - after_image (after photo)
  - created_by
  - assigned_to
  - department
  - citizen_feedback

notifications         # System notifications
  - id (UUID)
  - user_id
  - title
  - message
  - type
  - read

events                # Community events
  - id (UUID)
  - title
  - description
  - date
  - location

success_stories       # Resolved issues showcase
  - id (UUID)
  - issue_id
  - title
  - description
```

## 🛣️ Routes

### Public Routes
```
/                     # Landing page
/issues               # Issues list
/issue/:id            # Issue details
/report               # Report new issue
/events               # Community events
/event/:id            # Event details
```

### Authenticated Routes
```
/home                 # User homepage
/profile              # User profile
```

### Official Routes
```
/official/login       # Official login
/official/dashboard   # Official dashboard
/official/issue/:id   # Issue details
/official/upload-resolution/:id  # Upload photo
/official/profile     # Official profile
/official/onboarding  # First-time setup
```

### Admin Routes
```
/authority            # Authority dashboard
```

## 🎨 Common Components

### UI Components (shadcn/ui)
```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs } from "@/components/ui/tabs"
import { Select } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
```

### Custom Components
```tsx
import Navbar from "@/components/Navbar"
import { IssueCard } from "@/components/IssueCard"
import { IssueMap } from "@/components/IssueMap"
import { LoadingSpinner } from "@/components/LoadingSpinner"
```

## 🪝 Common Hooks

```tsx
// Auth
import { useAuth } from "@/contexts/SupabaseAuthContext"
const { currentUser, signIn, signOut } = useAuth()

// Toast notifications
import { useToast } from "@/components/ui/use-toast"
const { toast } = useToast()

// Navigation
import { useNavigate } from "react-router-dom"
const navigate = useNavigate()

// Custom hooks
import { useIssues } from "@/hooks/useIssues"
import { useDebounce } from "@/hooks/useDebounce"
import { useLocalStorage } from "@/hooks/useLocalStorage"
```

## 🔧 Common Patterns

### Fetching Data
```tsx
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('table')
      .select('*')
    
    if (error) {
      toast({ title: "Error", description: error.message })
      return
    }
    
    setData(data)
    setLoading(false)
  }
  
  fetchData()
}, [])
```

### Creating Records
```tsx
const handleCreate = async (formData) => {
  const { data, error } = await supabase
    .from('table')
    .insert(formData)
    .select()
    .single()
  
  if (error) {
    toast({ title: "Error", description: error.message })
    return
  }
  
  toast({ title: "Success", description: "Created successfully" })
  navigate('/success-page')
}
```

### Uploading Files
```tsx
const handleUpload = async (file) => {
  const fileName = `${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('bucket-name')
    .upload(fileName, file)
  
  if (error) {
    toast({ title: "Error", description: error.message })
    return
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('bucket-name')
    .getPublicUrl(fileName)
  
  return publicUrl
}
```

## 🎯 Status Values

### Issue Status
```
pending       # Newly reported
assigned      # Assigned to worker
in_progress   # Being worked on
resolved      # Completed by worker
closed        # Confirmed by citizen
```

### User Roles
```
citizen       # Regular user
official      # Municipal worker
admin         # Administrator
```

### Notification Types
```
issue_assigned
issue_updated
issue_resolved
feedback_received
```

## 📱 Responsive Breakpoints

```css
sm: 640px     /* Small devices */
md: 768px     /* Medium devices */
lg: 1024px    /* Large devices */
xl: 1280px    /* Extra large devices */
2xl: 1536px   /* 2X large devices */
```

## 🎨 Color Scheme

```css
Primary: Blue (#3B82F6)
Secondary: Gray (#6B7280)
Success: Green (#10B981)
Warning: Yellow (#F59E0B)
Error: Red (#EF4444)
```

## 🔍 Debugging

### Check Supabase Connection
```tsx
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('User:', currentUser)
```

### Check API Calls
```tsx
const { data, error } = await supabase.from('table').select('*')
console.log('Data:', data)
console.log('Error:', error)
```

### Check Environment
```tsx
console.log('Mode:', import.meta.env.MODE)
console.log('Dev:', import.meta.env.DEV)
console.log('Prod:', import.meta.env.PROD)
```

## 📞 Support

- **Documentation**: Check `docs/` folder
- **Issues**: GitHub Issues
- **Questions**: Open a discussion

## 🔗 Useful Links

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [React Router Docs](https://reactrouter.com)

---

**Tip**: Bookmark this page for quick reference!
