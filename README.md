# UrbanCare - Community Issue Reporting Platform

A modern web application built with React, TypeScript, and Supabase for reporting and managing community issues.

## 🚀 Recent Migration: Firebase → Supabase

This project has been successfully migrated from Firebase to Supabase for better developer experience and more powerful features.

### What Changed
- **Database**: Firestore → PostgreSQL (Supabase)
- **Authentication**: Firebase Auth → Supabase Auth
- **Storage**: Firebase Storage → Supabase Storage
- **Real-time**: Firebase Realtime → Supabase Realtime (ready to use)

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd urbancare
npm install
```

### 2. Set Up Supabase

#### Option A: Use the Setup Script
```bash
node setup-supabase.js
```

#### Option B: Manual Setup
1. Copy your Supabase project URL and anon key from your Supabase dashboard
2. Update `src/lib/supabase.ts` with your credentials:
```typescript
const supabaseUrl = 'your-project-url'
const supabaseAnonKey = 'your-anon-key'
```

### 3. Set Up Database Tables
Run the SQL commands from `SUPABASE_SETUP.md` in your Supabase SQL Editor to create the required tables.

### 4. Configure Authentication (Optional)
- Go to Authentication > Providers in your Supabase dashboard
- Enable Google OAuth if you want Google sign-in
- Add your site URL to the allowed redirect URLs

### 5. Run the Development Server
```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Configuration files
├── pages/              # Page components
├── services/           # API service functions
└── types/              # TypeScript type definitions
```

## 🔧 Key Features

- **Smart Landing Page**: Choose between Citizen and Authority access
- **User Authentication**: Sign up/in with email or Google
- **Issue Reporting**: Report community issues with photos
- **Event Management**: Create and manage community events
- **User Profiles**: Comprehensive user profile management
- **Authority Dashboard**: Advanced dashboard for authorities (coming soon)
- **Real-time Updates**: Ready for real-time features with Supabase
- **Responsive Design**: Works on all device sizes
- **Type Safety**: Full TypeScript support

## 🗄️ Database Schema

The application uses the following main tables:
- `user_profiles` - Extended user information
- `issues` - Community issues and reports
- `events` - Community events and activities

See `SUPABASE_SETUP.md` for complete schema and setup instructions.

## 🔐 Environment Variables (Optional)

Create a `.env.local` file for environment-based configuration:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Then update `src/lib/supabase.ts` to use environment variables:

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔍 Migration Notes

If you're migrating from the Firebase version:

1. **Data Migration**: Export your Firebase data and import it into Supabase
2. **Authentication**: Users will need to re-authenticate
3. **File Uploads**: Existing file URLs will need to be migrated to Supabase Storage
4. **Real-time Features**: Can now be easily added using Supabase's real-time subscriptions

See `MIGRATION_GUIDE.md` for detailed migration instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- Check `SUPABASE_SETUP.md` for setup issues
- Check `MIGRATION_GUIDE.md` for migration help
- Open an issue for bugs or feature requests

## 🎯 Roadmap

- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering
- [ ] Community voting on issues
- [ ] Integration with city services APIs
- [ ] Multi-language support