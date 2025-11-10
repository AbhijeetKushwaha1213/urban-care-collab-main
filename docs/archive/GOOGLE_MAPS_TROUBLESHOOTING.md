# Google Maps Integration Troubleshooting

## Common Issues and Solutions

### 🔧 **Map Loading Fails**

#### **Issue**: "Failed to load Google Maps" error appears

**Possible Causes & Solutions**:

1. **API Key Issues**:
   - ✅ **Check API Key**: Verify the API key is correct: `AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E`
   - ✅ **Enable APIs**: Ensure these APIs are enabled in Google Cloud Console:
     - Maps JavaScript API
     - Places API (optional)
     - Geocoding API (optional)

2. **Billing Issues**:
   - ✅ **Enable Billing**: Google Maps requires billing to be enabled
   - ✅ **Check Quota**: Verify you haven't exceeded daily/monthly limits
   - ✅ **Free Tier**: Google provides $200/month free credit

3. **Domain Restrictions**:
   - ✅ **Add Domains**: In Google Cloud Console, add these domains to API key restrictions:
     - `localhost:*` (for development)
     - `127.0.0.1:*` (for development)
     - Your production domain

### 🌐 **Setting Up Google Cloud Console**

#### **Step 1: Create/Select Project**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Note the project ID

#### **Step 2: Enable Required APIs**
1. Navigate to "APIs & Services" > "Library"
2. Search and enable:
   - **Maps JavaScript API** (Required)
   - **Places API** (Optional - for address autocomplete)
   - **Geocoding API** (Optional - for address to coordinates)

#### **Step 3: Create API Key**
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. Click "Restrict Key" for security

#### **Step 4: Configure API Key Restrictions**
1. **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add these referrers:
     ```
     http://localhost:*/*
     https://localhost:*/*
     http://127.0.0.1:*/*
     https://127.0.0.1:*/*
     https://yourdomain.com/*
     ```

2. **API restrictions**:
   - Select "Restrict key"
   - Choose: Maps JavaScript API, Places API, Geocoding API

#### **Step 5: Enable Billing**
1. Go to "Billing" in Google Cloud Console
2. Link a payment method
3. Google provides $200/month free credit

### 🔍 **Debugging Steps**

#### **Check Browser Console**
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Look for specific error messages:

**Common Error Messages**:
- `"This API project is not authorized"` → Check API key restrictions
- `"API key not valid"` → Verify API key is correct
- `"Billing account not configured"` → Enable billing
- `"RefererNotAllowedMapError"` → Add domain to referrer restrictions

#### **Test API Key Manually**
Open this URL in browser (replace YOUR_API_KEY):
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyD7nJAmr4M4-qfzUQtubXAgWpc1P4ATh9E&callback=console.log
```

If working, you should see Google Maps JavaScript loaded.

### 🛠️ **Implementation Fixes Applied**

#### **Enhanced Error Handling**
- ✅ Better error messages for different failure types
- ✅ Console logging for debugging
- ✅ Fallback list view when map fails to load

#### **Alternative Loading Method**
- ✅ Created `SimpleMap.tsx` with script tag loading
- ✅ More reliable than `@googlemaps/js-api-loader`
- ✅ Better error detection and handling

#### **Environment Configuration**
- ✅ API key stored in `.env.local`
- ✅ Fallback to hardcoded key for development
- ✅ TypeScript declarations for Google Maps

### 🚀 **Quick Fix Checklist**

If map is not loading, check these in order:

1. **✅ Browser Console**: Any error messages?
2. **✅ API Key**: Is it correct and not expired?
3. **✅ Billing**: Is billing enabled in Google Cloud?
4. **✅ APIs**: Are Maps JavaScript API enabled?
5. **✅ Restrictions**: Are domain restrictions properly set?
6. **✅ Network**: Any firewall/proxy blocking Google APIs?

### 📞 **Getting Help**

#### **Check Current Status**
- [Google Maps Platform Status](https://status.cloud.google.com/)
- [Google Cloud Console](https://console.cloud.google.com/)

#### **Useful Resources**
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
- [Troubleshooting Guide](https://developers.google.com/maps/documentation/javascript/error-messages)

### 🔄 **Fallback Options**

If Google Maps continues to fail:

1. **Static Map Images**: Use Google Static Maps API
2. **OpenStreetMap**: Alternative free mapping service
3. **List View**: Current fallback shows issues in a simple list
4. **Mapbox**: Alternative commercial mapping service

The current implementation includes a fallback list view that displays when the map fails to load, ensuring users can still see and interact with issues.