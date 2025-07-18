/**
 * JWT utility functions for decoding and validating JWT tokens
 */

export interface JwtHeader {
  alg: string;
  typ?: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JwtPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJwt {
  header: JwtHeader;
  payload: JwtPayload;
  signature: string;
}

/**
 * Decodes a JWT token without verification
 * @param token - The JWT token to decode
 * @returns Decoded JWT parts or error
 */
export function decodeJwt(token: string): {
  isValid: boolean;
  decoded?: DecodedJwt;
  error?: string;
} {
  if (!token) {
    return { isValid: false, error: 'Token is empty' };
  }

  // Check if the token has the correct format (three parts separated by dots)
  const parts = token.split('.');
  if (parts.length !== 3) {
    return {
      isValid: false,
      error:
        'Invalid token format. JWT should have three parts separated by dots.',
    };
  }

  try {
    // Decode header (first part)
    const header = JSON.parse(atob(parts[0]));

    // Decode payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // The signature is just the third part (we don't verify it here)
    const signature = parts[2];

    return {
      isValid: true,
      decoded: {
        header,
        payload,
        signature,
      },
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Failed to decode token',
    };
  }
}

/**
 * Checks if a JWT token is expired
 * @param payload - The decoded JWT payload
 * @returns Whether the token is expired
 */
export function isTokenExpired(payload: JwtPayload): boolean {
  if (!payload.exp) {
    return false; // No expiration time
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

/**
 * Checks if a JWT token is not yet valid
 * @param payload - The decoded JWT payload
 * @returns Whether the token is not yet valid
 */
export function isTokenNotYetValid(payload: JwtPayload): boolean {
  if (!payload.nbf) {
    return false; // No "not before" time
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.nbf > currentTime;
}

/**
 * Formats a Unix timestamp as a human-readable date string
 * @param timestamp - The Unix timestamp (in seconds)
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) {
    return 'N/A';
  }

  // Convert seconds to milliseconds
  const date = new Date(timestamp * 1000);

  return date.toLocaleString();
}

/**
 * Gets the time remaining until token expiration
 * @param payload - The decoded JWT payload
 * @returns Time remaining in human-readable format
 */
export function getTimeRemaining(payload: JwtPayload): string {
  if (!payload.exp) {
    return 'No expiration';
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const remainingSeconds = payload.exp - currentTime;

  if (remainingSeconds <= 0) {
    return 'Expired';
  }

  // Format the remaining time
  if (remainingSeconds < 60) {
    return `${remainingSeconds} seconds`;
  } else if (remainingSeconds < 3600) {
    return `${Math.floor(remainingSeconds / 60)} minutes`;
  } else if (remainingSeconds < 86400) {
    return `${Math.floor(remainingSeconds / 3600)} hours`;
  } else {
    return `${Math.floor(remainingSeconds / 86400)} days`;
  }
}

/**
 * Gets the token age (time since issued)
 * @param payload - The decoded JWT payload
 * @returns Token age in human-readable format
 */
export function getTokenAge(payload: JwtPayload): string {
  if (!payload.iat) {
    return 'Unknown';
  }

  const currentTime = Math.floor(Date.now() / 1000);
  const ageSeconds = currentTime - payload.iat;

  if (ageSeconds <= 0) {
    return 'Just issued';
  }

  // Format the age
  if (ageSeconds < 60) {
    return `${ageSeconds} seconds`;
  } else if (ageSeconds < 3600) {
    return `${Math.floor(ageSeconds / 60)} minutes`;
  } else if (ageSeconds < 86400) {
    return `${Math.floor(ageSeconds / 3600)} hours`;
  } else {
    return `${Math.floor(ageSeconds / 86400)} days`;
  }
}

/**
 * Gets a description of the token algorithm
 * @param alg - The algorithm identifier from the JWT header
 * @returns Description of the algorithm
 */
export function getAlgorithmDescription(alg: string): string {
  const algorithms: Record<string, string> = {
    HS256: 'HMAC with SHA-256',
    HS384: 'HMAC with SHA-384',
    HS512: 'HMAC with SHA-512',
    RS256: 'RSA Signature with SHA-256',
    RS384: 'RSA Signature with SHA-384',
    RS512: 'RSA Signature with SHA-512',
    ES256: 'ECDSA Signature with SHA-256',
    ES384: 'ECDSA Signature with SHA-384',
    ES512: 'ECDSA Signature with SHA-512',
    PS256: 'RSASSA-PSS with SHA-256',
    PS384: 'RSASSA-PSS with SHA-384',
    PS512: 'RSASSA-PSS with SHA-512',
    none: 'No digital signature or MAC',
  };

  return algorithms[alg] || `Unknown algorithm: ${alg}`;
}

/**
 * Generates a sample JWT token
 * @returns A sample JWT token
 */
export function generateSampleJwt(): string {
  // This is a static sample token with a header and payload
  // It's not a valid token (signature is fake) and should only be used for demonstration
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const currentTime = Math.floor(Date.now() / 1000);

  const payload = {
    sub: '1234567890',
    name: 'John Doe',
    email: 'john.doe@example.com',
    admin: true,
    iat: currentTime,
    exp: currentTime + 3600, // Expires in 1 hour
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const fakeSig = 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; // Not a real signature

  return `${encodedHeader}.${encodedPayload}.${fakeSig}`;
}
