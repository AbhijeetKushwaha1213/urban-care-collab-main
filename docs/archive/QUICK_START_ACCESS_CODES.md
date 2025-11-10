# Quick Start: Authority Access Codes

## As the Developer, Here's What You Need to Know

### 1. **You Control the Access Codes** 🔑
As the developer/system administrator, **you are the source** of authority access codes. You:
- Generate the codes
- Decide who gets them
- Distribute them securely
- Rotate them when needed

### 2. **Current Development Code** 🛠️
Right now, your development code is set in `.env.local`:
```
VITE_AUTHORITY_ACCESS_CODE=URBAN_CARE_AUTH_2024_SECURE
```

**Anyone with this code can create authority accounts in development.**

### 3. **Generate New Codes** ⚡
Use the built-in generator:
```bash
# Generate multiple secure code options
npm run generate-access-code

# Or generate a single code
npm run generate-access-code -- --single
```

### 4. **Who Gets the Code?** 👥
You decide based on your organization's needs:
- **Government employees** (city workers, municipal staff)
- **Department heads** (public works, health, police, etc.)
- **Authorized contractors** (if applicable)
- **System administrators** (other IT staff)

### 5. **How to Distribute Securely** 📧
**Good methods:**
- In-person during employee onboarding
- Secure internal email (company email addresses)
- Internal company documentation system
- Phone call (for verbal communication)

**Avoid:**
- Public channels (Slack, Teams without encryption)
- External email addresses
- Text messages or social media
- Public documentation

### 6. **Production Setup** 🚀
For production, set the environment variable in your hosting platform:

**Vercel:**
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add: `VITE_AUTHORITY_ACCESS_CODE` = `[your-secure-code]`

**Netlify:**
1. Site settings → Environment variables
2. Add: `VITE_AUTHORITY_ACCESS_CODE` = `[your-secure-code]`

**Supabase:**
1. Project settings → Environment Variables
2. Add: `VITE_AUTHORITY_ACCESS_CODE` = `[your-secure-code]`

### 7. **Example Distribution Email** 📝
```
Subject: UrbanCare Authority Account Setup

Hi [Name],

You've been authorized to create an authority account in our UrbanCare system.

Access Code: URBAN_CARE_2024_A7F3E9B2C1D4F6H8

Instructions:
1. Go to [your-domain.com]
2. Click "Authority Access"
3. Fill out the signup form
4. Enter the access code when prompted

Keep this code confidential and contact IT if you have issues.

Best regards,
IT Department
```

### 8. **Security Checklist** ✅
- [ ] Generate a unique code for production (don't use the default)
- [ ] Only share with legitimate authority personnel
- [ ] Use secure distribution methods
- [ ] Document who received codes and when
- [ ] Plan to rotate codes quarterly
- [ ] Monitor new authority account creation

### 9. **Testing Your Setup** 🧪
1. Try creating an authority account with the correct code ✅
2. Try creating an authority account with a wrong code ❌
3. Verify citizen signup still works normally ✅

### 10. **Emergency Procedures** 🚨
If a code is compromised:
1. **Immediately** change the environment variable
2. **Generate** a new secure code
3. **Notify** all current authority users
4. **Review** recent authority signups for suspicious activity

---

## Quick Commands

```bash
# Generate new access codes
npm run generate-access-code

# Test the current setup (in browser console)
testAuthorityVerification()
```

## Files to Reference
- `AUTHORITY_ACCESS_CODE_MANAGEMENT.md` - Complete management guide
- `src/components/AdminAccessCodeManager.tsx` - Admin interface component
- `scripts/generate-access-code.js` - Code generator script

**Remember: You are in control of who can become an authority user. The access code is your gatekeeper.**