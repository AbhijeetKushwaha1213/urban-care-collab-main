# Firebase to Supabase Migration Guide

## What's Changed

### 1. Dependencies
- ❌ Removed: `firebase`
- ✅ Added: `@supabase/supabase-js`

### 2. Configuration Files
- ❌ `src/lib/firebase.ts` → ✅ `src/lib/supabase.ts`
- ❌ `src/contexts/AuthContext.tsx` → ✅ `src/contexts/SupabaseAuthContext.tsx`
- ❌ `src/services/firestoreService.ts` → ✅ `src/services/supabaseService.ts`

### 3. Key Differences

#### Authentication
- **Firebase**: Uses Firebase Auth with `onAuthStateChanged`
- **Supabase**: Uses Supabase Auth with `onAuthStateChange`
- **Google OAuth**: Supabase uses `signInWithOAuth` instead of `signInWithPopup`

#### Database
- **Firebase**: Firestore (NoSQL document database)
- **Supabase**: PostgreSQL (Relational database)
- **Queries**: SQL-like syntax instead of Firestore queries

#### Storage
- **Firebase**: Firebase Storage
- **Supabase**: Supabase Storage (similar API)

## Migration Steps

### Step 1: Update Your Main App
Replace the Firebase AuthContext import with Supabase:

```typescript
// In src/main.tsx or wherever you use AuthProvider
import { AuthProvider } from '@/contexts/SupabaseAuthContext'
```

### Step 2: Update Service Imports
Replace Firestore service imports with Supabase:

```typescript
// Old
import { getEvents, createEvent } from '@/services/firestoreService'

// New
import { getEvents, createEvent } from '@/services/supabaseService'
```

### Step 3: Update Component Imports
Replace Firebase imports in components:

```typescript
// Old
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

// New
import { supabase } from '@/lib/supabase'
```

### Step 4: Update Test Functions
Replace Firebase test functions:

```typescript
// Old
import { testFirebaseConnection } from '@/lib/firebase'

// New
import { testSupabaseConnection } from '@/lib/supabase'
```

## Files That Need Updates

1. **src/main.tsx** - Update AuthProvider import
2. **src/pages/UserOnboarding.tsx** - Update database calls
3. **src/pages/Profile.tsx** - Update database calls
4. **src/pages/ReportIssue.tsx** - Update database and storage calls
5. **src/components/EditProfileModal.tsx** - Update auth and database calls
6. **src/components/AuthModal.tsx** - Update test functions
7. **src/components/FirebaseSetupBanner.tsx** - Replace with Supabase setup banner

## Data Migration

If you have existing data in Firebase:
1. Export your Firestore data
2. Transform the data structure for PostgreSQL
3. Import into Supabase using the dashboard or API

## Testing

After migration:
1. Test user registration and login
2. Test Google OAuth (if configured)
3. Test creating/reading events and issues
4. Test file uploads (if used)
5. Test user profile management

## Rollback Plan

If you need to rollback:
1. Reinstall Firebase: `npm install firebase`
2. Restore the original files from git
3. Update imports back to Firebase services