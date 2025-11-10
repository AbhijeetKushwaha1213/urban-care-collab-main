# Google Maps API Setup Guide

This guide will help you set up Google Maps API for location features in Civic Connect.

## Prerequisites

- Google Cloud account
- Credit card (for API activation, but free tier is generous)

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Enter project name: "Civic Connect"
4. Click "Create"

## Step 2: Enable Required APIs

1. Go to "APIs & Services" → "Library"
2. Search and enable these APIs:
   - **Maps JavaScript API** (for map display)
   - **Places API** (for address autocomplete)
   - **Geocoding API** (for address to coordinates conversion)
   - **Geolocation API** (optional, for GPS features)

## Step 3: Create API Key

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Copy the API key
4. Click "Edit API key" to configure restrictions

## Step 4: Restrict Your API Key

### Application Restrictions
For development:
- Select "HTTP referrers"
- Add: `http://localhost:*`
- Add: `http://127.0.0.1:*`

For production:
- Add your production domain: `https://yourdomain.com/*`

### API Restrictions
- Select "Restrict key"
- Choose these APIs:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Geolocation API

## Step 5: Add to Environment Variables

Add your API key to `.env.local`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Step 6: Configure Billing (Required)

1. Go to "Billing" in Google Cloud Console
2. Link a billing account
3. Set up budget alerts (recommended):
   - Go to "Budgets & alerts"
   - Create budget: $50/month
   - Set alert at 50%, 90%, 100%

**Note**: Google provides $200 free credit monthly, which is usually sufficient for small to medium apps.

## Features Using Google Maps

### 1. Location Picker
- Interactive map for selecting issue location
- Drag marker to adjust position
- Address autocomplete

### 2. Issue Map View
- Display all issues on a map
- Cluster markers for better performance
- Click markers to view issue details

### 3. Address Autocomplete
- Real-time address suggestions
- Automatic coordinate extraction
- Support for multiple countries

### 4. GPS Location
- Get user's current location
- Reverse geocoding (coordinates to address)
- Location permission handling

## Testing Your Setup

1. Start your dev server: `npm run dev`
2. Go to "Report Issue" page
3. Try these features:
   - Click "Use Current Location"
   - Type in address field (should show suggestions)
   - Click on map to select location
   - Verify coordinates are captured

## Troubleshooting

### Map not loading
- Check if API key is correct in `.env.local`
- Verify Maps JavaScript API is enabled
- Check browser console for errors
- Ensure referrer restrictions allow your domain

### Autocomplete not working
- Verify Places API is enabled
- Check API key restrictions
- Look for quota exceeded errors

### "This page can't load Google Maps correctly"
- Usually means billing is not set up
- Or API key restrictions are too strict
- Check Google Cloud Console for specific error

### Quota exceeded
- Check usage in Google Cloud Console
- Increase budget if needed
- Optimize API calls (caching, debouncing)

## Cost Optimization Tips

1. **Enable caching**: Cache geocoding results
2. **Debounce autocomplete**: Wait for user to stop typing
3. **Use static maps**: For thumbnails/previews
4. **Implement lazy loading**: Load maps only when needed
5. **Monitor usage**: Set up alerts for unusual spikes

## API Usage Limits (Free Tier)

- **Maps JavaScript API**: $200 credit = ~28,000 map loads
- **Places Autocomplete**: $200 credit = ~1,000 requests
- **Geocoding API**: $200 credit = ~40,000 requests

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all keys
3. **Restrict API keys** to specific domains
4. **Enable only required APIs**
5. **Monitor usage** regularly
6. **Rotate keys** if compromised

## Alternative: OpenStreetMap

If you want to avoid Google Maps costs, consider OpenStreetMap with Leaflet:

```bash
npm install leaflet react-leaflet
```

See `src/components/SimpleMap.tsx` for a Leaflet implementation example.

## Next Steps

- [Database Setup](DATABASE_SETUP.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Official Portal Setup](../features/OFFICIAL_PORTAL.md)
