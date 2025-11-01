# Authority Verification System Design

## Overview

The Authority Verification System adds a secure access code verification step to the existing authentication flow. When users attempt to sign up as authorities, they must provide a valid access code to proceed. This design integrates seamlessly with the existing AuthModal component and authentication context.

## Architecture

### Component Architecture
```
AuthModal (Enhanced)
├── Citizen Signup Form (unchanged)
├── Authority Signup Form (enhanced)
│   ├── Standard Fields (name, email, password, department)
│   └── Authority Access Code Field (new)
├── Access Code Validation Logic (new)
└── Error Handling (enhanced)

SupabaseAuthContext (Enhanced)
├── signUp method (enhanced with access code validation)
├── validateAuthorityCode method (new)
└── Error handling (enhanced)
```

### Security Architecture
- **Client-side**: Input validation and user experience
- **Server-side**: Secure access code validation via Supabase Edge Functions
- **Environment Variables**: Secure storage of access codes

## Components and Interfaces

### 1. Enhanced AuthModal Component

#### New Props
```typescript
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
  userType?: 'citizen' | 'authority';
}
```

#### New State Variables
```typescript
const [authorityAccessCode, setAuthorityAccessCode] = useState('');
const [isValidatingCode, setIsValidatingCode] = useState(false);
```

#### Authority Access Code Field
- Input type: password (for security)
- Placeholder: "Enter authority access code"
- Validation: Required when userType === 'authority'
- Error states: Invalid code, empty field, network errors

### 2. Enhanced Authentication Context

#### New Method: validateAuthorityCode
```typescript
const validateAuthorityCode = async (accessCode: string): Promise<boolean> => {
  // Server-side validation via Supabase Edge Function
  // Returns true if code is valid, false otherwise
}
```

#### Enhanced signUp Method
```typescript
const signUp = async (
  email: string, 
  password: string, 
  name: string, 
  userType: string = 'citizen', 
  department?: string,
  authorityAccessCode?: string
) => {
  // Validate authority access code if userType is 'authority'
  // Proceed with normal signup if validation passes
}
```

### 3. Supabase Edge Function (New)

#### Function: validate-authority-code
```typescript
// Location: supabase/functions/validate-authority-code/index.ts
export default async function handler(req: Request) {
  const { accessCode } = await req.json();
  const validCode = Deno.env.get('AUTHORITY_ACCESS_CODE');
  
  return new Response(
    JSON.stringify({ isValid: accessCode === validCode }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
```

## Data Models

### Environment Variables
```bash
# .env.local (for development)
AUTHORITY_ACCESS_CODE=URBAN_CARE_AUTH_2024_SECURE

# Supabase Environment Variables (for production)
AUTHORITY_ACCESS_CODE=<secure-production-code>
```

### Enhanced User Profile
No changes to existing user_profiles table structure - the verification happens during signup only.

## Error Handling

### Client-Side Error States
1. **Empty Access Code**: "Authority access code is required"
2. **Invalid Access Code**: "Invalid authority access code. Please contact your administrator."
3. **Network Error**: "Unable to verify access code. Please try again."
4. **Validation Timeout**: "Verification timed out. Please try again."

### Server-Side Error Handling
1. **Missing Environment Variable**: Log error, return generic failure
2. **Invalid Request Format**: Return 400 Bad Request
3. **Rate Limiting**: Implement to prevent brute force attacks

## Testing Strategy

### Unit Tests
- AuthModal component with authority access code field
- Access code validation logic
- Error state handling
- Form submission with valid/invalid codes

### Integration Tests
- End-to-end authority signup flow
- Access code validation via Edge Function
- Error handling across client-server boundary
- User experience flows for both citizen and authority signup

### Security Tests
- Access code not exposed in client-side code
- Server-side validation cannot be bypassed
- Rate limiting prevents brute force attacks
- Environment variable security

## Implementation Phases

### Phase 1: Client-Side Enhancement
1. Add authority access code field to AuthModal
2. Implement client-side validation and error handling
3. Update form submission logic

### Phase 2: Server-Side Validation
1. Create Supabase Edge Function for access code validation
2. Set up environment variables
3. Integrate server-side validation with client

### Phase 3: Enhanced Security
1. Implement rate limiting
2. Add logging and monitoring
3. Security testing and hardening

### Phase 4: User Experience Polish
1. Loading states and animations
2. Clear error messages and help text
3. Accessibility improvements

## Security Considerations

### Access Code Management
- Use environment variables for secure storage
- Implement code rotation capability
- Consider multiple access codes for different departments

### Validation Security
- Server-side validation only (never trust client)
- Rate limiting to prevent brute force
- Secure transmission (HTTPS only)
- No access code logging or exposure

### User Experience Security
- Mask access code input
- Clear sensitive data on component unmount
- Secure error messages (don't reveal system details)

## Configuration

### Default Access Code
For development and initial setup: `URBAN_CARE_AUTH_2024_SECURE`

### Production Deployment
1. Generate secure random access code
2. Set environment variable in Supabase dashboard
3. Share access code securely with authorized personnel
4. Document code rotation procedures