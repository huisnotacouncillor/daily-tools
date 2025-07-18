import { describe, it, expect } from 'vitest';
import {
  validateAndParseJson,
  formatJson,
  minifyJson,
  getJsonStats,
  escapeJsonString,
  convertToJson,
} from '../json-utils';

describe('validateAndParseJson', () => {
  it('should validate and parse valid JSON', () => {
    const result = validateAndParseJson('{"name": "John", "age": 30}');
    expect(result.isValid).toBe(true);
    expect(result.data).toEqual({ name: 'John', age: 30 });
    expect(result.error).toBeUndefined();
  });

  it('should handle empty string', () => {
    const result = validateAndParseJson('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('JSON string is empty');
  });

  it('should handle whitespace-only string', () => {
    const result = validateAndParseJson('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('JSON string is empty');
  });

  it('should handle invalid JSON', () => {
    const result = validateAndParseJson('{"name": "John",}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should parse arrays', () => {
    const result = validateAndParseJson('[1, 2, 3]');
    expect(result.isValid).toBe(true);
    expect(result.data).toEqual([1, 2, 3]);
  });

  it('should parse primitive values', () => {
    const result = validateAndParseJson('42');
    expect(result.isValid).toBe(true);
    expect(result.data).toBe(42);
  });
});

describe('formatJson', () => {
  it('should format valid JSON with default indentation', () => {
    const result = formatJson('{"name":"John","age":30}');
    expect(result.isValid).toBe(true);
    expect(result.formatted).toBe('{\n  "name": "John",\n  "age": 30\n}');
  });

  it('should format with custom indentation', () => {
    const result = formatJson('{"name":"John"}', 4);
    expect(result.isValid).toBe(true);
    expect(result.formatted).toBe('{\n    "name": "John"\n}');
  });

  it('should handle invalid JSON', () => {
    const result = formatJson('{"name":}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should format arrays', () => {
    const result = formatJson('[1,2,3]');
    expect(result.isValid).toBe(true);
    expect(result.formatted).toBe('[\n  1,\n  2,\n  3\n]');
  });
});

describe('minifyJson', () => {
  it('should minify formatted JSON', () => {
    const input = '{\n  "name": "John",\n  "age": 30\n}';
    const result = minifyJson(input);
    expect(result.isValid).toBe(true);
    expect(result.minified).toBe('{"name":"John","age":30}');
  });

  it('should handle invalid JSON', () => {
    const result = minifyJson('{"name":}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should minify arrays', () => {
    const input = '[\n  1,\n  2,\n  3\n]';
    const result = minifyJson(input);
    expect(result.isValid).toBe(true);
    expect(result.minified).toBe('[1,2,3]');
  });
});

describe('getJsonStats', () => {
  it('should get stats for object', () => {
    const data = { name: 'John', age: 30, active: true };
    const stats = getJsonStats(data);
    expect(stats.type).toBe('object');
    expect(stats.keys).toBe(3);
    expect(stats.depth).toBe(1);
    expect(stats.objects).toBe(1);
    expect(stats.strings).toBe(1);
    expect(stats.numbers).toBe(1);
    expect(stats.booleans).toBe(1);
  });

  it('should get stats for array', () => {
    const data = [1, 'hello', true, null];
    const stats = getJsonStats(data);
    expect(stats.type).toBe('array');
    expect(stats.keys).toBeUndefined();
    expect(stats.depth).toBe(1);
    expect(stats.arrays).toBe(1);
    expect(stats.numbers).toBe(1);
    expect(stats.strings).toBe(1);
    expect(stats.booleans).toBe(1);
    expect(stats.nulls).toBe(1);
  });

  it('should calculate depth correctly', () => {
    const data = { level1: { level2: { level3: 'deep' } } };
    const stats = getJsonStats(data);
    expect(stats.depth).toBe(3);
  });

  it('should handle primitive values', () => {
    const stats = getJsonStats(42);
    expect(stats.type).toBe('number');
    expect(stats.depth).toBe(0);
    expect(stats.numbers).toBe(1);
  });

  it('should handle null', () => {
    const stats = getJsonStats(null);
    expect(stats.type).toBe('null');
    expect(stats.depth).toBe(0);
    expect(stats.nulls).toBe(1);
  });
});

describe('escapeJsonString', () => {
  it('should escape special characters', () => {
    const input = 'Hello\n"World"\t\\';
    const result = escapeJsonString(input);
    expect(result).toBe('Hello\\n\\"World\\"\\t\\\\');
  });

  it('should handle empty string', () => {
    const result = escapeJsonString('');
    expect(result).toBe('');
  });

  it('should handle string without special characters', () => {
    const result = escapeJsonString('Hello World');
    expect(result).toBe('Hello World');
  });
});

describe('convertToJson', () => {
  it('should convert valid JSON', () => {
    const result = convertToJson('{"name":"John"}');
    expect(result.isValid).toBe(true);
    expect(result.json).toBe('{\n  "name": "John"\n}');
  });

  it('should handle invalid JSON', () => {
    const result = convertToJson('{"name":}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle empty input', () => {
    const result = convertToJson('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Input is empty');
  });

  it('should handle unsupported format', () => {
    const result = convertToJson('data', 'yaml');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe("Format 'yaml' is not supported yet");
  });
});
