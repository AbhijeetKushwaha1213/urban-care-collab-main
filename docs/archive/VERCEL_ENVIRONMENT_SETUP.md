# 🔧 Vercel Environment Setup Guide

## 🚨 Critical: Environment Variables Required

Your app is showing a blank page because the environment variables are not properly configured in Vercel. Here's how to fix it:

## 📋 Required Environment Variables

Add these **EXACT VALUES** in your **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

### 1. Supabase Configuration
```
VITE_SUPABASE_URL=https://vzqtjhoevvjxdgocnfju.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXRqaG9ldnZqeGRnb2NuZmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTk5MjksImV4cCI6MjA3NzM5NTkyOX0.Y_z1NwNMsGtgJk-0opVJv4ZHj0mCSc7taQsuwcA7jJ0
```

### 2. Google APIs
```
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E
VITE_GOOGLE_VISION_API_KEY=AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E
```

### 3. Authority Access Code
```
VITE_AUTHORITY_ACCESS_CODE=URBAN_CARE_AUTH_2024_SECURE
```

## 🔧 How to Add Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add each variable:
   - **Name**: `VITE_SUPABASE_URL`
   - **Value**: `https://vzqtjhoevvjxdgocnfju.supabase.co`
   - **Environment**: Select all (Production, Preview, Development)
6. Repeat for all variables above

### Method 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Set environment variables
vercel env add VITE_SUPABASE_URL
# Enter: https://vzqtjhoevvjxdgocnfju.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY
# Enter: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6cXRqaG9ldnZqeGRnb2NuZmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTk5MjksImV4cCI6MjA3NzM5NTkyOX0.Y_z1NwNMsGtgJk-0opVJv4ZHj0mCSc7taQsuwcA7jJ0

vercel env add VITE_GOOGLE_MAPS_API_KEY
# Enter: AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E

vercel env add VITE_GOOGLE_VISION_API_KEY
# Enter: AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E

vercel env add VITE_AUTHORITY_ACCESS_CODE
# Enter: URBAN_CARE_AUTH_2024_SECURE
```

## 🚀 After Adding Environment Variables

1. **Redeploy your application**:
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on the latest deployment
   - OR push a new commit to trigger automatic deployment

2. **Verify the deployment**:
   - Wait for deployment to complete
   - Visit your Vercel URL
   - The app should now load properly

## 🔍 Troubleshooting

### If the app is still blank:

1. **Check Browser Console**:
   - Open Developer Tools (F12)
   - Look for error messages
   - Common errors: "Missing environment variables"

2. **Verify Environment Variables**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all 4 variables are present
   - Check for typos in variable names

3. **Check Build Logs**:
   - Go to Vercel Dashboard → Deployments
   - Click on the latest deployment
   - Check build logs for errors

### Common Issues:

1. **Variable Names**: Must start with `VITE_` for Vite to include them
2. **Spaces**: No spaces in variable names or values
3. **Quotes**: Don't add quotes around values in Vercel dashboard
4. **Case Sensitive**: Variable names are case-sensitive

## 📱 Test Your Deployment

After setting environment variables and redeploying:

1. **Visit your Vercel URL**
2. **Check these features**:
   - ✅ App loads (no blank page)
   - ✅ Navigation works
   - ✅ User can sign up/sign in
   - ✅ Maps load (if Google Maps key is set)
   - ✅ Issues page loads

## 🔐 Security Notes

- **Never commit** `.env.local` to git
- **Use different values** for production vs development
- **Rotate access codes** regularly
- **Restrict API keys** to your domain only

## 📞 Need Help?

If you're still having issues:

1. Check the browser console for specific error messages
2. Verify all environment variables are set correctly
3. Try a fresh deployment
4. Check Supabase dashboard for any service issues

Your app should work perfectly once the environment variables are properly configured! 🎉