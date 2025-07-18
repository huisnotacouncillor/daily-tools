import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  decodeJwt,
  encodeJwt,
  verifyJwtSignature,
  isTokenExpired,
  isTokenNotYetValid,
  formatTimestamp,
  getTimeRemaining,
  getTokenAge,
  getAlgorithmDescription,
  generateSampleJwt,
  getDefaultJwtHeader,
  getDefaultJwtPayload,
  getSupportedAlgorithms,
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

describe('encodeJwt', () => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: '1234567890', name: 'John Doe', iat: mockTimestamp };
  const secret = 'test-secret-key';

  it('should encode a JWT token with HS256', () => {
    const token = encodeJwt(header, payload, secret, 'HS256');
    const parts = token.split('.');
    expect(parts.length).toBe(3);

    // Verify the token can be decoded
    const decoded = decodeJwt(token);
    expect(decoded.isValid).toBe(true);
    expect(decoded.decoded?.header.alg).toBe('HS256');
    expect(decoded.decoded?.payload.name).toBe('John Doe');
  });

  it('should encode a JWT token with HS384', () => {
    const token = encodeJwt(header, payload, secret, 'HS384');
    const parts = token.split('.');
    expect(parts.length).toBe(3);

    const decoded = decodeJwt(token);
    expect(decoded.isValid).toBe(true);
    expect(decoded.decoded?.header.alg).toBe('HS384');
  });

  it('should encode a JWT token with HS512', () => {
    const token = encodeJwt(header, payload, secret, 'HS512');
    const parts = token.split('.');
    expect(parts.length).toBe(3);

    const decoded = decodeJwt(token);
    expect(decoded.isValid).toBe(true);
    expect(decoded.decoded?.header.alg).toBe('HS512');
  });

  it('should set default algorithm to HS256', () => {
    const token = encodeJwt(header, payload, secret);
    const decoded = decodeJwt(token);
    expect(decoded.decoded?.header.alg).toBe('HS256');
  });

  it('should add typ field if not present', () => {
    const headerWithoutTyp = { alg: 'HS256' };
    const token = encodeJwt(headerWithoutTyp, payload, secret);
    const decoded = decodeJwt(token);
    expect(decoded.decoded?.header.typ).toBe('JWT');
  });

  it('should preserve existing typ field', () => {
    const headerWithTyp = { alg: 'HS256', typ: 'custom' };
    const token = encodeJwt(headerWithTyp, payload, secret);
    const decoded = decodeJwt(token);
    expect(decoded.decoded?.header.typ).toBe('custom');
  });
});

describe('verifyJwtSignature', () => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: '1234567890', name: 'John Doe', iat: mockTimestamp };
  const secret = 'test-secret-key';
  const wrongSecret = 'wrong-secret';

  it('should verify a valid JWT signature', () => {
    const token = encodeJwt(header, payload, secret);
    const result = verifyJwtSignature(token, secret);
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject an invalid JWT signature', () => {
    const token = encodeJwt(header, payload, secret);
    const result = verifyJwtSignature(token, wrongSecret);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Signature verification failed');
  });

  it('should handle empty token', () => {
    const result = verifyJwtSignature('', secret);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Token and secret are required');
  });

  it('should handle empty secret', () => {
    const token = encodeJwt(header, payload, secret);
    const result = verifyJwtSignature(token, '');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Token and secret are required');
  });

  it('should handle invalid token format', () => {
    const result = verifyJwtSignature('invalid.token', secret);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Invalid token format');
  });

  it('should handle token without algorithm', () => {
    const headerWithoutAlg = { typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(headerWithoutAlg));
    const encodedPayload = btoa(JSON.stringify(payload));
    const invalidToken = `${encodedHeader}.${encodedPayload}.signature`;

    const result = verifyJwtSignature(invalidToken, secret);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('No algorithm specified in header');
  });

  it('should verify tokens with different algorithms', () => {
    const algorithms = ['HS256', 'HS384', 'HS512'];

    algorithms.forEach(alg => {
      const token = encodeJwt({ ...header, alg }, payload, secret, alg);
      const result = verifyJwtSignature(token, secret);
      expect(result.isValid).toBe(true);
    });
  });
});

describe('getDefaultJwtHeader', () => {
  it('should return default header with HS256 algorithm', () => {
    const header = getDefaultJwtHeader();
    expect(header.alg).toBe('HS256');
    expect(header.typ).toBe('JWT');
  });
});

describe('getDefaultJwtPayload', () => {
  it('should return default payload with basic claims', () => {
    const payload = getDefaultJwtPayload();
    expect(payload.sub).toBe('1234567890');
    expect(payload.name).toBe('John Doe');
    expect(payload.iat).toBeTypeOf('number');
    expect(payload.exp).toBeTypeOf('number');
    expect(payload.exp).toBeGreaterThan(payload.iat!);
  });
});

describe('getSupportedAlgorithms', () => {
  it('should return list of supported algorithms', () => {
    const algorithms = getSupportedAlgorithms();
    expect(algorithms).toContain('HS256');
    expect(algorithms).toContain('HS384');
    expect(algorithms).toContain('HS512');
    expect(algorithms).toContain('none');
  });

  it('should return an array', () => {
    const algorithms = getSupportedAlgorithms();
    expect(Array.isArray(algorithms)).toBe(true);
    expect(algorithms.length).toBeGreaterThan(0);
  });
});
