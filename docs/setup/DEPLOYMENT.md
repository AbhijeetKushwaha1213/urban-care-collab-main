# Deployment Guide

This guide covers deploying Civic Connect to production using Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Completed database setup
- Google Maps API key configured

## Option 1: Deploy with Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/civic-connect.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Vite
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 3: Add Environment Variables

In Vercel project settings, add these environment variables:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_CLOUD_VISION_API_KEY=your_vision_key (optional)
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Visit your deployment URL

### Step 5: Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Option 2: Deploy with Netlify

### Step 1: Create netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy

1. Go to [Netlify](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Add environment variables
6. Deploy

## Post-Deployment Checklist

### 1. Update Supabase Settings

In Supabase dashboard:
1. Go to Authentication → URL Configuration
2. Add your production URL to:
   - Site URL
   - Redirect URLs

### 2. Update Google Maps API Restrictions

In Google Cloud Console:
1. Go to APIs & Services → Credentials
2. Edit your API key
3. Add production domain to HTTP referrers:
   ```
   https://yourdomain.com/*
   https://*.vercel.app/*
   ```

### 3. Test Core Features

- [ ] User registration/login
- [ ] Issue reporting
- [ ] Image upload
- [ ] Map functionality
- [ ] Official portal access
- [ ] Notifications
- [ ] Real-time updates

### 4. Set Up Monitoring

#### Vercel Analytics
1. Go to Project → Analytics
2. Enable Web Analytics
3. Monitor page views and performance

#### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

Configure in `src/main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### 5. Configure Caching

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Performance Optimization

### 1. Enable Compression

Vercel automatically enables gzip/brotli compression.

### 2. Optimize Images

```bash
npm install vite-plugin-imagemin -D
```

Update `vite.config.ts`:
```typescript
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      svgo: { plugins: [{ removeViewBox: false }] }
    })
  ]
});
```

### 3. Code Splitting

Already configured with Vite's automatic code splitting.

### 4. Lazy Loading

Implement lazy loading for routes:
```typescript
const IssueDetail = lazy(() => import('./pages/IssueDetail'));
```

## Security Checklist

- [ ] Environment variables are not exposed in client code
- [ ] API keys are restricted to production domains
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] CSP headers are configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] XSS protection is enabled

## Monitoring & Maintenance

### Daily Checks
- Monitor error rates in Sentry
- Check Supabase usage/quotas
- Review Google Maps API usage

### Weekly Checks
- Review user feedback
- Check performance metrics
- Update dependencies

### Monthly Checks
- Security audit
- Database optimization
- Cost analysis

## Rollback Procedure

If deployment fails:

1. Go to Vercel dashboard
2. Click on Deployments
3. Find last working deployment
4. Click "..." → "Promote to Production"

## Troubleshooting

### Build Fails

Check build logs for:
- TypeScript errors
- Missing dependencies
- Environment variable issues

```bash
# Test build locally
npm run build
npm run preview
```

### Runtime Errors

1. Check browser console
2. Review Vercel function logs
3. Check Supabase logs
4. Verify environment variables

### Performance Issues

1. Use Lighthouse for audit
2. Check bundle size: `npm run build -- --analyze`
3. Review network requests
4. Optimize images and assets

## Scaling Considerations

### Database
- Monitor Supabase usage
- Upgrade plan if needed
- Implement connection pooling
- Add database indexes

### API Limits
- Monitor Google Maps usage
- Implement caching
- Consider CDN for static assets

### Serverless Functions
- Optimize function cold starts
- Implement edge caching
- Use Vercel Edge Functions for critical paths

## Backup Strategy

### Database Backups
Supabase automatically backs up your database daily.

Manual backup:
1. Go to Supabase dashboard
2. Database → Backups
3. Download backup

### Code Backups
- GitHub serves as primary backup
- Tag releases: `git tag v1.0.0`
- Keep deployment history in Vercel

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)

## Next Steps

- Set up CI/CD pipeline
- Implement automated testing
- Configure staging environment
- Set up monitoring alerts
