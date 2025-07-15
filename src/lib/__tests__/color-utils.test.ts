import { describe, it, expect } from 'vitest';
import {
  parseHexColor,
  rgbToHex,
  parseRgbColor,
  rgbToHsl,
  hslToRgb,
  parseHslColor,
  formatRgb,
  formatRgba,
  formatHsl,
  formatHsla,
  getContrastRatio,
  getColorBrightness
} from '../color-utils';

describe('parseHexColor', () => {
  it('should parse 6-digit hex color', () => {
    const result = parseHexColor('#FF0000');
    expect(result.isValid).toBe(true);
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should parse 3-digit hex color', () => {
    const result = parseHexColor('#F00');
    expect(result.isValid).toBe(true);
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should parse hex without #', () => {
    const result = parseHexColor('FF0000');
    expect(result.isValid).toBe(true);
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should handle invalid hex', () => {
    const result = parseHexColor('#GG0000');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle wrong length hex', () => {
    const result = parseHexColor('#FF00');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('rgbToHex', () => {
  it('should convert RGB to hex', () => {
    const result = rgbToHex({ r: 255, g: 0, b: 0 });
    expect(result).toBe('#FF0000');
  });

  it('should handle values outside 0-255 range', () => {
    const result = rgbToHex({ r: 300, g: -10, b: 128 });
    expect(result).toBe('#FF0080');
  });

  it('should pad single digit hex values', () => {
    const result = rgbToHex({ r: 1, g: 2, b: 3 });
    expect(result).toBe('#010203');
  });
});

describe('parseRgbColor', () => {
  it('should parse RGB string', () => {
    const result = parseRgbColor('rgb(255, 0, 0)');
    expect(result.isValid).toBe(true);
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should parse RGBA string', () => {
    const result = parseRgbColor('rgba(255, 0, 0, 0.5)');
    expect(result.isValid).toBe(true);
    expect(result.rgba).toEqual({ r: 255, g: 0, b: 0, a: 0.5 });
  });

  it('should handle spaces in RGB string', () => {
    const result = parseRgbColor('rgb( 255 , 0 , 0 )');
    expect(result.isValid).toBe(true);
    expect(result.rgb).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should handle invalid RGB values', () => {
    const result = parseRgbColor('rgb(300, 0, 0)');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle invalid format', () => {
    const result = parseRgbColor('rgb(255, 0)');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('rgbToHsl', () => {
  it('should convert red to HSL', () => {
    const result = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(result).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('should convert green to HSL', () => {
    const result = rgbToHsl({ r: 0, g: 255, b: 0 });
    expect(result).toEqual({ h: 120, s: 100, l: 50 });
  });

  it('should convert blue to HSL', () => {
    const result = rgbToHsl({ r: 0, g: 0, b: 255 });
    expect(result).toEqual({ h: 240, s: 100, l: 50 });
  });

  it('should convert white to HSL', () => {
    const result = rgbToHsl({ r: 255, g: 255, b: 255 });
    expect(result).toEqual({ h: 0, s: 0, l: 100 });
  });

  it('should convert black to HSL', () => {
    const result = rgbToHsl({ r: 0, g: 0, b: 0 });
    expect(result).toEqual({ h: 0, s: 0, l: 0 });
  });
});

describe('hslToRgb', () => {
  it('should convert red HSL to RGB', () => {
    const result = hslToRgb({ h: 0, s: 100, l: 50 });
    expect(result).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('should convert green HSL to RGB', () => {
    const result = hslToRgb({ h: 120, s: 100, l: 50 });
    expect(result).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('should convert blue HSL to RGB', () => {
    const result = hslToRgb({ h: 240, s: 100, l: 50 });
    expect(result).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('should convert gray HSL to RGB', () => {
    const result = hslToRgb({ h: 0, s: 0, l: 50 });
    expect(result).toEqual({ r: 128, g: 128, b: 128 });
  });
});

describe('parseHslColor', () => {
  it('should parse HSL string', () => {
    const result = parseHslColor('hsl(0, 100%, 50%)');
    expect(result.isValid).toBe(true);
    expect(result.hsl).toEqual({ h: 0, s: 100, l: 50 });
  });

  it('should parse HSLA string', () => {
    const result = parseHslColor('hsla(0, 100%, 50%, 0.5)');
    expect(result.isValid).toBe(true);
    expect(result.hsla).toEqual({ h: 0, s: 100, l: 50, a: 0.5 });
  });

  it('should handle invalid HSL values', () => {
    const result = parseHslColor('hsl(400, 100%, 50%)');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should handle invalid format', () => {
    const result = parseHslColor('hsl(0, 100%)');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('format functions', () => {
  it('should format RGB', () => {
    const result = formatRgb({ r: 255, g: 0, b: 0 });
    expect(result).toBe('rgb(255, 0, 0)');
  });

  it('should format RGBA', () => {
    const result = formatRgba({ r: 255, g: 0, b: 0, a: 0.5 });
    expect(result).toBe('rgba(255, 0, 0, 0.5)');
  });

  it('should format HSL', () => {
    const result = formatHsl({ h: 0, s: 100, l: 50 });
    expect(result).toBe('hsl(0, 100%, 50%)');
  });

  it('should format HSLA', () => {
    const result = formatHsla({ h: 0, s: 100, l: 50, a: 0.5 });
    expect(result).toBe('hsla(0, 100%, 50%, 0.5)');
  });
});

describe('getContrastRatio', () => {
  it('should calculate contrast ratio between black and white', () => {
    const black = { r: 0, g: 0, b: 0 };
    const white = { r: 255, g: 255, b: 255 };
    const ratio = getContrastRatio(black, white);
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('should calculate contrast ratio between same colors', () => {
    const red = { r: 255, g: 0, b: 0 };
    const ratio = getContrastRatio(red, red);
    expect(ratio).toBe(1);
  });
});

describe('getColorBrightness', () => {
  it('should identify white as light', () => {
    const result = getColorBrightness({ r: 255, g: 255, b: 255 });
    expect(result).toBe('light');
  });

  it('should identify black as dark', () => {
    const result = getColorBrightness({ r: 0, g: 0, b: 0 });
    expect(result).toBe('dark');
  });

  it('should identify red as dark', () => {
    const result = getColorBrightness({ r: 255, g: 0, b: 0 });
    expect(result).toBe('dark');
  });

  it('should identify yellow as light', () => {
    const result = getColorBrightness({ r: 255, g: 255, b: 0 });
    expect(result).toBe('light');
  });
});
