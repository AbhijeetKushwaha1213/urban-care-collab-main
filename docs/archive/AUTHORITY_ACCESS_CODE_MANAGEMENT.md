# Authority Access Code Management Guide

## Overview
This guide explains how to manage the authority access codes that control who can create authority accounts in the UrbanCare system.

## Access Code Workflow

### 1. Developer/System Administrator Role
As the developer or system administrator, you are responsible for:
- **Generating** secure access codes
- **Distributing** codes to legitimate authority personnel
- **Rotating** codes periodically for security
- **Revoking** access when needed

### 2. Authority Personnel Role
Government/municipal employees who need authority accounts must:
- **Obtain** the access code from their IT department or system administrator
- **Use** the code during signup to verify their legitimacy
- **Keep** the code confidential and secure

## Code Generation and Management

### Development Environment
For development and testing, the default code is set in `.env.local`:
```bash
VITE_AUTHORITY_ACCESS_CODE=URBAN_CARE_AUTH_2024_SECURE
```

### Production Environment
For production, you should:

1. **Generate a Secure Code**
   ```bash
   # Example secure code generation (use one of these methods)
   
   # Method 1: Random alphanumeric (recommended)
   openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
   
   # Method 2: UUID-based
   uuidgen | tr -d '-' | tr '[:lower:]' '[:upper:]'
   
   # Method 3: Custom format
   echo "URBAN_CARE_$(date +%Y)_$(openssl rand -hex 8 | tr '[:lower:]' '[:upper:]')"
   ```

2. **Set in Production Environment**
   - **Supabase**: Go to Project Settings > Environment Variables
   - **Vercel**: Go to Project Settings > Environment Variables  
   - **Netlify**: Go to Site Settings > Environment Variables
   - **Other platforms**: Follow their environment variable setup process

3. **Example Production Setup**
   ```bash
   VITE_AUTHORITY_ACCESS_CODE=URBAN_CARE_2024_A7F3E9B2C1D4F6H8
   ```

## Distribution Process

### Step 1: Identify Legitimate Authority Personnel
Work with your organization to identify who should have authority access:
- Department heads
- Municipal employees
- Government officials
- Authorized contractors

### Step 2: Secure Distribution Methods
**Recommended methods:**
- **In-person handoff** during onboarding
- **Secure internal email** (encrypted if possible)
- **Internal documentation system** (password-protected)
- **Phone call** for verbal communication

**Avoid these methods:**
- ❌ Public channels (Slack, Teams without encryption)
- ❌ Unencrypted email to external addresses
- ❌ Text messages or social media
- ❌ Public documentation or wikis

### Step 3: Documentation Template
Create an internal document for authority personnel:

```markdown
# UrbanCare Authority Account Setup

## Access Code
Your authority access code is: [INSERT_CODE_HERE]

## Instructions
1. Go to [your-urbancare-domain.com]
2. Click "Authority Access" 
3. Fill out the signup form
4. Enter the access code when prompted
5. Complete your account setup

## Security
- Keep this code confidential
- Do not share with unauthorized personnel
- Contact IT if you suspect the code is compromised

## Support
Contact: [your-it-support-email]
```

## Code Rotation and Security

### When to Rotate Codes
- **Quarterly** (recommended for high-security environments)
- **Semi-annually** (minimum recommended frequency)
- **Immediately** if code is compromised
- **When personnel leave** the organization

### Rotation Process
1. **Generate new code** using secure methods above
2. **Update environment variables** in all environments
3. **Notify current authority users** of the change
4. **Update internal documentation**
5. **Test the new code** works correctly

### Emergency Revocation
If a code is compromised:
1. **Immediately change** the environment variable
2. **Notify all authority personnel** of the breach
3. **Review recent authority signups** for suspicious activity
4. **Generate and distribute** a new secure code

## Multiple Access Codes (Advanced)

For larger organizations, you might want different codes for different departments:

### Environment Setup
```bash
# Multiple department codes
VITE_AUTHORITY_ACCESS_CODE_PUBLIC_WORKS=PW_2024_A1B2C3D4
VITE_AUTHORITY_ACCESS_CODE_HEALTH=HEALTH_2024_E5F6G7H8
VITE_AUTHORITY_ACCESS_CODE_POLICE=POLICE_2024_I9J0K1L2
```

### Code Modification Required
You would need to modify `src/utils/authValidation.ts` to support multiple codes:

```typescript
export const validateAuthorityAccessCode = async (accessCode: string, department?: string): Promise<boolean> => {
  try {
    // Get department-specific code or fallback to general code
    const validCodes = [
      import.meta.env.VITE_AUTHORITY_ACCESS_CODE,
      import.meta.env.VITE_AUTHORITY_ACCESS_CODE_PUBLIC_WORKS,
      import.meta.env.VITE_AUTHORITY_ACCESS_CODE_HEALTH,
      import.meta.env.VITE_AUTHORITY_ACCESS_CODE_POLICE,
    ].filter(Boolean);
    
    return validCodes.includes(accessCode);
  } catch (error) {
    console.error('Error validating authority access code:', error);
    return false;
  }
};
```

## Monitoring and Auditing

### Track Authority Signups
Monitor your user database for new authority accounts:
```sql
-- Check recent authority signups
SELECT 
  full_name, 
  email, 
  department, 
  created_at 
FROM user_profiles 
WHERE user_type = 'authority' 
AND created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;
```

### Set Up Alerts
Consider setting up notifications for:
- New authority account creations
- Failed access code attempts (if you implement logging)
- Unusual signup patterns

## Troubleshooting

### Common Issues
1. **"Access code not configured"**
   - Check environment variable is set correctly
   - Verify variable name matches exactly
   - Restart your application after changes

2. **"Invalid authority access code"**
   - Verify the code was entered correctly
   - Check for extra spaces or characters
   - Confirm the environment variable is deployed

3. **Code not working after rotation**
   - Ensure new code is deployed to production
   - Clear browser cache
   - Verify environment variable update

### Testing Access Codes
Use the test script in `src/test-authority-verification.ts`:
```javascript
// In browser console
testAuthorityVerification();
```

## Security Best Practices

1. **Use strong, unique codes** (25+ characters, mixed case, numbers)
2. **Rotate regularly** (quarterly recommended)
3. **Limit distribution** to only necessary personnel
4. **Monitor usage** and audit authority accounts
5. **Document the process** for your organization
6. **Train personnel** on security importance
7. **Have a revocation plan** ready for emergencies

## Contact and Support

For technical issues with access code implementation:
- Check the application logs
- Review environment variable configuration
- Test with the provided validation functions
- Contact your development team

For access code distribution and management:
- Work with your IT security team
- Follow your organization's security policies
- Document all code changes and distributions