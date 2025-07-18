import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  decodeJwt,
  isTokenExpired,
  isTokenNotYetValid,
  formatTimestamp,
  getTimeRemaining,
  getTokenAge,
  getAlgorithmDescription,
  generateSampleJwt,
} from '../jwt-utils';

// Mock Date.now for consistent testing
const mockDate = new Date('2023-01-01T00:00:00Z');
const mockTimestamp = Math.floor(mockDate.getTime() / 1000);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(mockDate);
});

describe('decodeJwt', () => {
  it('should decode a valid JWT token', () => {
    // Create a simple JWT token
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { sub: '1234567890', name: 'John Doe' };
    const signature = 'signature';

    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const token = `${encodedHeader}.${encodedPayload}.${signature}`;

    const result = decodeJwt(token);

    expect(result.isValid).toBe(true);
    expect(result.decoded?.header).toEqual(header);
    expect(result.decoded?.payload).toEqual(payload);
    expect(result.decoded?.signature).toBe(signature);
  });

  it('should handle empty token', () => {
    const result = decodeJwt('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Token is empty');
  });

  it('should handle invalid token format', () => {
    const result = decodeJwt('invalid.token');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe(
      'Invalid token format. JWT should have three parts separated by dots.'
    );
  });

  it('should handle malformed base64', () => {
    const result = decodeJwt('invalid.invalid.invalid');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('isTokenExpired', () => {
  it('should return false for token without exp claim', () => {
    const payload = { sub: '1234567890' };
    expect(isTokenExpired(payload)).toBe(false);
  });

  it('should return true for expired token', () => {
    const payload = { exp: mockTimestamp - 3600 }; // Expired 1 hour ago
    expect(isTokenExpired(payload)).toBe(true);
  });

  it('should return false for valid token', () => {
    const payload = { exp: mockTimestamp + 3600 }; // Expires in 1 hour
    expect(isTokenExpired(payload)).toBe(false);
  });
});

describe('isTokenNotYetValid', () => {
  it('should return false for token without nbf claim', () => {
    const payload = { sub: '1234567890' };
    expect(isTokenNotYetValid(payload)).toBe(false);
  });

  it('should return true for token not yet valid', () => {
    const payload = { nbf: mockTimestamp + 3600 }; // Valid in 1 hour
    expect(isTokenNotYetValid(payload)).toBe(true);
  });

  it('should return false for currently valid token', () => {
    const payload = { nbf: mockTimestamp - 3600 }; // Valid since 1 hour ago
    expect(isTokenNotYetValid(payload)).toBe(false);
  });
});

describe('formatTimestamp', () => {
  it('should format timestamp correctly', () => {
    const result = formatTimestamp(mockTimestamp);
    expect(result).toBe(mockDate.toLocaleString());
  });

  it('should handle zero timestamp', () => {
    const result = formatTimestamp(0);
    expect(result).toBe('N/A');
  });
});

describe('getTimeRemaining', () => {
  it('should return "No expiration" for token without exp', () => {
    const payload = { sub: '1234567890' };
    expect(getTimeRemaining(payload)).toBe('No expiration');
  });

  it('should return "Expired" for expired token', () => {
    const payload = { exp: mockTimestamp - 3600 };
    expect(getTimeRemaining(payload)).toBe('Expired');
  });

  it('should return seconds for short duration', () => {
    const payload = { exp: mockTimestamp + 30 };
    expect(getTimeRemaining(payload)).toBe('30 seconds');
  });

  it('should return minutes for medium duration', () => {
    const payload = { exp: mockTimestamp + 300 }; // 5 minutes
    expect(getTimeRemaining(payload)).toBe('5 minutes');
  });

  it('should return hours for long duration', () => {
    const payload = { exp: mockTimestamp + 7200 }; // 2 hours
    expect(getTimeRemaining(payload)).toBe('2 hours');
  });

  it('should return days for very long duration', () => {
    const payload = { exp: mockTimestamp + 172800 }; // 2 days
    expect(getTimeRemaining(payload)).toBe('2 days');
  });
});

describe('getTokenAge', () => {
  it('should return "Unknown" for token without iat', () => {
    const payload = { sub: '1234567890' };
    expect(getTokenAge(payload)).toBe('Unknown');
  });

  it('should return "Just issued" for future iat', () => {
    const payload = { iat: mockTimestamp + 60 };
    expect(getTokenAge(payload)).toBe('Just issued');
  });

  it('should return seconds for short age', () => {
    const payload = { iat: mockTimestamp - 30 };
    expect(getTokenAge(payload)).toBe('30 seconds');
  });

  it('should return minutes for medium age', () => {
    const payload = { iat: mockTimestamp - 300 }; // 5 minutes ago
    expect(getTokenAge(payload)).toBe('5 minutes');
  });

  it('should return hours for long age', () => {
    const payload = { iat: mockTimestamp - 7200 }; // 2 hours ago
    expect(getTokenAge(payload)).toBe('2 hours');
  });

  it('should return days for very long age', () => {
    const payload = { iat: mockTimestamp - 172800 }; // 2 days ago
    expect(getTokenAge(payload)).toBe('2 days');
  });
});

describe('getAlgorithmDescription', () => {
  it('should return correct description for known algorithms', () => {
    expect(getAlgorithmDescription('HS256')).toBe('HMAC with SHA-256');
    expect(getAlgorithmDescription('RS256')).toBe('RSA Signature with SHA-256');
    expect(getAlgorithmDescription('ES256')).toBe(
      'ECDSA Signature with SHA-256'
    );
    expect(getAlgorithmDescription('none')).toBe('No digital signature or MAC');
  });

  it('should return unknown message for unknown algorithm', () => {
    expect(getAlgorithmDescription('UNKNOWN')).toBe(
      'Unknown algorithm: UNKNOWN'
    );
  });
});

describe('generateSampleJwt', () => {
  it('should generate a valid JWT format', () => {
    const token = generateSampleJwt();
    const parts = token.split('.');
    expect(parts.length).toBe(3);
  });

  it('should generate a decodable token', () => {
    const token = generateSampleJwt();
    const result = decodeJwt(token);
    expect(result.isValid).toBe(true);
    expect(result.decoded?.header.alg).toBe('HS256');
    expect(result.decoded?.payload.name).toBe('John Doe');
  });
});
