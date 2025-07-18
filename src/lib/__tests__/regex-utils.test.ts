import { describe, it, expect } from 'vitest';
import {
  validateRegexPattern,
  testRegexPattern,
  explainRegexPattern,
  highlightMatches,
} from '../regex-utils';

describe('validateRegexPattern', () => {
  it('should validate a valid regex pattern', () => {
    const result = validateRegexPattern('abc');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
    expect(result.regex).toBeInstanceOf(RegExp);
  });

  it('should invalidate an empty pattern', () => {
    const result = validateRegexPattern('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Pattern is empty');
  });

  it('should invalidate an invalid regex pattern', () => {
    const result = validateRegexPattern('[');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('testRegexPattern', () => {
  it('should find matches in a string', () => {
    const result = testRegexPattern('a', 'abc');
    expect(result.isValid).toBe(true);
    expect(result.matches.length).toBe(1);
    expect(result.matches[0][0]).toBe('a');
  });

  it('should find all matches with global flag', () => {
    const result = testRegexPattern('a', 'abcabc', 'g');
    expect(result.isValid).toBe(true);
    expect(result.matches.length).toBe(2);
  });

  it('should return empty matches for no match', () => {
    const result = testRegexPattern('z', 'abc');
    expect(result.isValid).toBe(true);
    expect(result.matches.length).toBe(0);
  });

  it('should handle empty test string', () => {
    const result = testRegexPattern('a', '');
    expect(result.isValid).toBe(true);
    expect(result.matches.length).toBe(0);
    expect(result.error).toBe('Test string is empty');
  });

  it('should handle empty pattern', () => {
    const result = testRegexPattern('', 'abc');
    expect(result.isValid).toBe(false);
    expect(result.matches.length).toBe(0);
    expect(result.error).toBe('Pattern is empty');
  });

  it('should handle invalid pattern', () => {
    const result = testRegexPattern('[', 'abc');
    expect(result.isValid).toBe(false);
    expect(result.matches.length).toBe(0);
    expect(result.error).toBeDefined();
  });
});

describe('explainRegexPattern', () => {
  it('should explain basic regex components', () => {
    const result = explainRegexPattern('\\d+');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(item => item.component === '\\d')).toBe(true);
    expect(result.some(item => item.component === '+')).toBe(true);
  });

  it('should explain regex with flags', () => {
    const result = explainRegexPattern('/abc/gi');
    expect(result.length).toBeGreaterThan(0);
    expect(result.some(item => item.component === '/gi')).toBe(true);
  });

  it('should return empty array for empty pattern', () => {
    const result = explainRegexPattern('');
    expect(result.length).toBe(0);
  });
});

describe('highlightMatches', () => {
  it('should highlight a single match', () => {
    const match = ['a'] as RegExpMatchArray;
    match.index = 0;
    const matches = [match];
    const result = highlightMatches('abc', matches);

    expect(result.length).toBe(2);
    expect(result[0]).toEqual({
      text: 'a',
      isMatch: true,
      matchIndex: 0,
    });
    expect(result[1]).toEqual({
      text: 'bc',
      isMatch: false,
    });
  });

  it('should highlight multiple matches', () => {
    const match1 = ['a'] as RegExpMatchArray;
    match1.index = 0;
    const match2 = ['c'] as RegExpMatchArray;
    match2.index = 2;
    const matches = [match1, match2];

    const result = highlightMatches('abc', matches);

    expect(result.length).toBe(3);
    expect(result[0]).toEqual({
      text: 'a',
      isMatch: true,
      matchIndex: 0,
    });
    expect(result[1]).toEqual({
      text: 'b',
      isMatch: false,
    });
    expect(result[2]).toEqual({
      text: 'c',
      isMatch: true,
      matchIndex: 1,
    });
  });

  it('should handle no matches', () => {
    const result = highlightMatches('abc', []);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      text: 'abc',
      isMatch: false,
    });
  });

  it('should handle empty test string', () => {
    const result = highlightMatches('', []);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      text: '',
      isMatch: false,
    });
  });
});
