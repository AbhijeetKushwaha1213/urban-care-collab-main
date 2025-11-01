/**
 * Authority access code validation utilities
 * Provides secure validation functions for authority account creation
 */

/**
 * Validates an authority access code against the configured secure code
 * @param accessCode - The access code to validate
 * @returns Promise<boolean> - True if the code is valid, false otherwise
 */
export const validateAuthorityAccessCode = async (accessCode: string): Promise<boolean> => {
  try {
    // Get the configured access code from environment variables
    const validCode = import.meta.env.VITE_AUTHORITY_ACCESS_CODE;
    
    if (!validCode) {
      console.error('Authority access code not configured in environment variables');
      return false;
    }
    
    // Perform secure comparison
    return accessCode === validCode;
  } catch (error) {
    console.error('Error validating authority access code:', error);
    return false;
  }
};

/**
 * Checks if the authority access code is properly configured
 * @returns boolean - True if the code is configured, false otherwise
 */
export const isAuthorityAccessCodeConfigured = (): boolean => {
  const validCode = import.meta.env.VITE_AUTHORITY_ACCESS_CODE;
  return Boolean(validCode && validCode.length > 0);
};

/**
 * Sanitizes access code input by trimming whitespace
 * @param accessCode - The raw access code input
 * @returns string - The sanitized access code
 */
export const sanitizeAccessCode = (accessCode: string): string => {
  return accessCode.trim();
};