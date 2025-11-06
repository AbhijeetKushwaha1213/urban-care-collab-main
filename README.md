# 🏙️ Nagar Setu - Community Issue Management Platform

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nagar-setu)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

> A modern, community-driven platform for reporting, tracking, and managing urban issues with real-time updates, Google Maps integration, and AI-powered features.

## ✨ Features

- 🗺️ **Interactive Maps** - Google Maps integration with real-time issue tracking
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔐 **Secure Authentication** - Authority verification with access codes
- 🤖 **AI-Powered Analysis** - Automatic issue description using Google Vision API
- 📸 **Multi-Photo Upload** - Camera, file upload, and gallery selection
- ⚡ **Real-time Updates** - Live status updates and notifications
- 👥 **Role-based Access** - Citizen and Authority user types
- 📊 **Analytics Dashboard** - Issue tracking and management for authorities

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/nagar-setu.git
cd nagar-setu
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Start Development

```bash
npm run dev
```

Visit `http://localhost:8080` to see your app running!

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **One-Click Deploy**
   
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/nagar-setu)

2. **Manual Deploy**
   
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Deployment Check**
   
   ```bash
   npm run deploy:check
   ```

### Environment Variables for Production

Set these in your Vercel dashboard:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_AUTHORITY_ACCESS_CODE=your_secure_access_code
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (Database, Auth, Real-time)
- **Maps**: Google Maps API
- **AI**: Google Vision API
- **Deployment**: Vercel
- **State Management**: React Context + Custom Hooks

## 📁 Project Structure

```
├── 📁 src/
│   ├── 📁 components/     # Reusable UI components
│   ├── 📁 pages/         # Route components
│   ├── 📁 hooks/         # Custom React hooks
│   ├── 📁 services/      # API services
│   ├── 📁 types/         # TypeScript definitions
│   └── 📁 utils/         # Utility functions
├── 📁 docs/              # Documentation
├── 📁 scripts/           # Build scripts
└── 📄 Config files       # Various configurations
```

## 🔧 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
npm run deploy:check     # Pre-deployment validation
npm run generate-access-code  # Generate authority codes
```

## 📚 Documentation

- 📖 [Deployment Guide](docs/DEPLOYMENT.md)
- 🏗️ [Project Structure](docs/FOLDER_STRUCTURE.md)
- ⚡ [Vercel Optimization](docs/VERCEL_OPTIMIZATION.md)
- 🔧 [Setup Guides](docs/setup/)
- ✨ [Feature Documentation](docs/features/)

## 🔐 Security Features

- **Authority Verification** - Secure access codes for authority accounts
- **Row Level Security** - Database-level security with Supabase RLS
- **Environment Protection** - Secure API key management
- **Input Validation** - Comprehensive form and data validation
- **Security Headers** - OWASP recommended security headers

## 🎯 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Bundle Size**: < 200KB initial load (gzipped)
- **Core Web Vitals**: Optimized for excellent user experience
- **Lazy Loading**: Components and routes loaded on demand
- **CDN Optimization**: Static assets served via Vercel Edge Network

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@nagarsetu.com
- 📖 **Documentation**: [docs/](docs/)
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/nagar-setu/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/nagar-setu/discussions)

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Vercel](https://vercel.com) for hosting and deployment
- [Google Maps](https://developers.google.com/maps) for mapping services
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling

---

<div align="center">
  <p>Built with ❤️ for better communities</p>
  <p>
    <a href="https://your-urbancare-app.vercel.app">Live Demo</a> •
    <a href="docs/DEPLOYMENT.md">Deploy Your Own</a> •
    <a href="docs/">Documentation</a>
  </p>
</div>