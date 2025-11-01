# UrbanCare Deployment Guide

## Vercel Deployment

### 1. Build Configuration
The project is configured with `vercel.json` for proper deployment.

### 2. Environment Variables
No environment variables needed - Supabase credentials are configured in the code.

### 3. Deploy Steps

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N (for first deployment)
# - What's your project's name? urbancare
# - In which directory is your code located? ./
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your Git repository
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Install Command: `npm install`
8. Click "Deploy"

### 4. Custom Domain (Optional)
After deployment, you can add a custom domain in the Vercel dashboard.

### 5. Troubleshooting

#### Blank Page Issues:
- Check browser console for errors
- Verify build completed successfully
- Ensure `vercel.json` is in root directory
- Check that all routes redirect to `index.html`

#### Build Errors:
- Run `npm run build` locally first
- Fix any TypeScript errors
- Ensure all dependencies are in `package.json`

### 6. Automatic Deployments
Once connected to Git, Vercel will automatically deploy:
- **Production**: When you push to `main` branch
- **Preview**: When you push to other branches or create PRs

## Build Commands

```bash
# Local development
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## Project Structure
```
urbancare/
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   └── lib/
├── public/
├── vercel.json
└── package.json
```