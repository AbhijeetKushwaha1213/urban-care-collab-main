# Google Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. "Google authentication is not properly configured" Error

**Cause:** Google OAuth is not set up in Supabase or Google Cloud Console.

**Solution:**
1. **Set up Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project or select existing one
   - Enable the **Google+ API** (or **Google Identity API**)
   - Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     ```
     https://your-project-id.supabase.co/auth/v1/callback
     http://localhost:8081/auth/callback
     ```

2. **Configure Supabase:**
   - Go to **Authentication** > **Providers** in Supabase dashboard
   - Enable **Google** provider
   - Add your **Client ID** and **Client Secret** from Google Cloud Console

### 2. "Redirect URI mismatch" Error

**Cause:** The redirect URI in your app doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Check your Google Cloud Console OAuth settings
2. Ensure these URIs are added:
   - `https://your-project-id.supabase.co/auth/v1/callback`
   - `http://localhost:8081/auth/callback` (for development)
3. Make sure the port number matches your development server

### 3. Google Sign-in Button Does Nothing

**Cause:** Usually a configuration issue or popup blocker.

**Solution:**
1. **Check browser console** for errors
2. **Disable popup blockers** for your development site
3. **Verify Supabase configuration:**
   ```bash
   # Check if your Supabase URL and key are correct
   console.log('Supabase URL:', supabase.supabaseUrl)
   ```

### 4. "Invalid login credentials" After Google Redirect

**Cause:** Session handling issue or configuration mismatch.

**Solution:**
1. **Clear browser storage:**
   - Clear localStorage and sessionStorage
   - Clear cookies for your domain
2. **Check Supabase logs:**
   - Go to **Logs** in Supabase dashboard
   - Look for authentication errors
3. **Verify redirect URL configuration**

### 5. User Gets Stuck on "Completing sign in..." Page

**Cause:** AuthCallback component can't process the authentication result.

**Solution:**
1. **Check browser console** on the callback page
2. **Verify database permissions:**
   - Ensure `user_profiles` table exists
   - Check Row Level Security policies
3. **Test with a simple callback:**
   ```typescript
   // Temporary debug version
   console.log('Session data:', data.session)
   console.log('User data:', data.session?.user)
   ```

## Testing Your Setup

### 1. Manual Test Steps
1. Open your app in an incognito/private window
2. Click "Sign in with Google"
3. Complete Google authentication
4. Verify you're redirected back to your app
5. Check that user profile is created in Supabase

### 2. Debug Console Commands
```javascript
// Check current session
supabase.auth.getSession().then(console.log)

// Check user data
supabase.auth.getUser().then(console.log)

// Test database connection
supabase.from('user_profiles').select('*').limit(1).then(console.log)
```

### 3. Common Configuration Values

**Development:**
- Site URL: `http://localhost:8081`
- Redirect URL: `http://localhost:8081/auth/callback`

**Production:**
- Site URL: `https://yourdomain.com`
- Redirect URL: `https://yourdomain.com/auth/callback`

## Quick Fix Checklist

- [ ] Google Cloud Console project created
- [ ] Google+ API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Correct redirect URIs added to Google Cloud Console
- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret added to Supabase
- [ ] Site URL configured in Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] `user_profiles` table exists with correct schema
- [ ] RLS policies allow user profile creation
- [ ] Browser popup blockers disabled for testing

## Still Having Issues?

1. **Check Supabase Logs:** Go to your Supabase dashboard > Logs
2. **Check Browser Console:** Look for JavaScript errors
3. **Test with Email/Password:** Verify basic auth works first
4. **Contact Support:** Include error messages and configuration details

## Environment Variables (Optional)

For better security, you can use environment variables:

```env
# .env.local
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Then update your configuration to use these values.