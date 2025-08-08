# Authentication Troubleshooting Guide

## Common Issues and Solutions

### 1. Google Sign-In Not Working

**Symptoms:**
- Google sign-in button doesn't respond
- Popup is blocked
- "Popup was blocked" error message

**Solutions:**
1. **Allow Popups**: Make sure your browser allows popups for this site
2. **Check Firebase Console**: Verify Google Auth is enabled in Firebase Console
3. **Domain Configuration**: Ensure your domain is added to authorized domains in Firebase Console

**Steps to fix:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`urabancollab`)
3. Go to Authentication > Sign-in method
4. Enable Google provider
5. Add your domain to authorized domains

### 2. Email/Password Sign-In Not Working

**Symptoms:**
- "User not found" errors
- "Wrong password" errors
- Account creation fails

**Solutions:**
1. **Check Firebase Console**: Verify Email/Password auth is enabled
2. **Password Requirements**: Ensure password is at least 6 characters
3. **Email Format**: Verify email is in correct format

### 3. Firebase Connection Issues

**Symptoms:**
- "Firebase connection failed" errors
- Network errors
- Timeout errors

**Solutions:**
1. **Check Internet Connection**: Ensure stable internet connection
2. **Firebase Project Status**: Check if Firebase project is active
3. **API Keys**: Verify Firebase config is correct

### 4. Development vs Production Issues

**Development Mode:**
- Use the "Test Firebase Connection" button in the auth modal
- Check browser console for detailed error messages
- Ensure you're running on `localhost` or authorized domain

**Production Mode:**
- Verify domain is added to Firebase authorized domains
- Check if Firebase project is on the correct plan
- Ensure all required services are enabled

## Debug Steps

1. **Open Browser Console** (F12)
2. **Check for Errors**: Look for red error messages
3. **Test Connection**: Use the debug button in auth modal (development only)
4. **Check Network Tab**: See if Firebase requests are being made
5. **Verify Firebase Config**: Ensure all config values are correct

## Firebase Console Checklist

- [ ] Authentication enabled
- [ ] Google provider enabled
- [ ] Email/Password provider enabled
- [ ] Domain added to authorized domains
- [ ] Firestore Database enabled
- [ ] Security rules configured

## Common Error Codes

- `auth/popup-blocked`: Browser blocked popup
- `auth/user-not-found`: No account with this email
- `auth/wrong-password`: Incorrect password
- `auth/email-already-in-use`: Account already exists
- `auth/weak-password`: Password too short
- `auth/invalid-email`: Invalid email format

## Getting Help

If issues persist:
1. Check browser console for specific error messages
2. Verify Firebase project configuration
3. Test with different browser/incognito mode
4. Check Firebase project logs in console 