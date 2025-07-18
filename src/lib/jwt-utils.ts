/**
 * JWT utility functions for decoding, encoding, and validating JWT tokens
 */

import CryptoJS from 'crypto-js';

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

export interface JwtVerificationResult {
  isValid: boolean;
  error?: string;
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

/**
 * Encodes a JWT token with the given header, payload, and secret
 * @param header - The JWT header
 * @param payload - The JWT payload
 * @param secret - The secret key for signing
 * @param algorithm - The signing algorithm (default: HS256)
 * @returns Encoded JWT token
 */
export function encodeJwt(
  header: JwtHeader,
  payload: JwtPayload,
  secret: string,
  algorithm: string = 'HS256'
): string {
  // Ensure algorithm is set in header
  const fullHeader = { ...header, alg: algorithm, typ: header.typ || 'JWT' };

  // Base64URL encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(fullHeader));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  // Create signature
  const signature = signJwt(
    `${encodedHeader}.${encodedPayload}`,
    secret,
    algorithm
  );

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a JWT token signature
 * @param token - The JWT token to verify
 * @param secret - The secret key used for signing
 * @returns Verification result
 */
export function verifyJwtSignature(
  token: string,
  secret: string
): {
  isValid: boolean;
  error?: string;
} {
  if (!token || !secret) {
    return { isValid: false, error: 'Token and secret are required' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { isValid: false, error: 'Invalid token format' };
  }

  try {
    const [encodedHeader, encodedPayload, signature] = parts;
    const header = JSON.parse(atob(encodedHeader)) as JwtHeader;

    if (!header.alg) {
      return { isValid: false, error: 'No algorithm specified in header' };
    }

    // Generate expected signature
    const expectedSignature = signJwt(
      `${encodedHeader}.${encodedPayload}`,
      secret,
      header.alg
    );

    // Compare signatures
    const isValid = signature === expectedSignature;

    return {
      isValid,
      error: isValid ? undefined : 'Signature verification failed',
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}

/**
 * Signs a JWT payload using the specified algorithm
 * @param data - The data to sign (header.payload)
 * @param secret - The secret key
 * @param algorithm - The signing algorithm
 * @returns Base64URL encoded signature
 */
function signJwt(data: string, secret: string, algorithm: string): string {
  let signature: string;

  switch (algorithm) {
    case 'HS256':
      signature = CryptoJS.HmacSHA256(data, secret).toString(
        CryptoJS.enc.Base64
      );
      break;
    case 'HS384':
      signature = CryptoJS.HmacSHA384(data, secret).toString(
        CryptoJS.enc.Base64
      );
      break;
    case 'HS512':
      signature = CryptoJS.HmacSHA512(data, secret).toString(
        CryptoJS.enc.Base64
      );
      break;
    case 'none':
      return '';
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  // Convert base64 to base64url
  return signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Base64URL encode a string
 * @param str - String to encode
 * @returns Base64URL encoded string
 */
function base64UrlEncode(str: string): string {
  // Handle unicode characters properly by using TextEncoder
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Convert to binary string
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }

  // Base64 encode and convert to base64url
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Gets default header for JWT
 * @returns Default JWT header
 */
export function getDefaultJwtHeader(): JwtHeader {
  return {
    alg: 'HS256',
    typ: 'JWT',
  };
}

/**
 * Gets default payload for JWT
 * @returns Default JWT payload
 */
export function getDefaultJwtPayload(): JwtPayload {
  const currentTime = Math.floor(Date.now() / 1000);
  return {
    sub: '1234567890',
    name: 'John Doe',
    iat: currentTime,
    exp: currentTime + 3600, // 1 hour
  };
}

/**
 * Gets supported algorithms for JWT signing
 * @returns Array of supported algorithms
 */
export function getSupportedAlgorithms(): string[] {
  return ['HS256', 'HS384', 'HS512', 'none'];
}
