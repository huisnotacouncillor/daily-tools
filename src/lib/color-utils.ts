/**
 * Color utility functions for converting between different color formats
 */

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface RGBAColor extends RGBColor {
  a: number;
}

export interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export interface HSLAColor extends HSLColor {
  a: number;
}

/**
 * Validates and parses a HEX color string
 * @param hex - The HEX color string (with or without #)
 * @returns Validation result and parsed RGB values
 */
export function parseHexColor(hex: string): {
  isValid: boolean;
  rgb?: RGBColor;
  error?: string;
} {
  // Remove # if present and convert to uppercase
  const cleanHex = hex.replace('#', '').toUpperCase();

  // Check if it's a valid hex format
  if (!/^[0-9A-F]{3}$|^[0-9A-F]{6}$/.test(cleanHex)) {
    return {
      isValid: false,
      error:
        'Invalid HEX format. Use 3 or 6 digit hex values (e.g., #FF0000 or #F00)',
    };
  }

  let r: number, g: number, b: number;

  if (cleanHex.length === 3) {
    // Convert 3-digit hex to 6-digit
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    // 6-digit hex
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }

  return {
    isValid: true,
    rgb: { r, g, b },
  };
}

/**
 * Converts RGB values to HEX string
 * @param rgb - RGB color object
 * @returns HEX color string
 */
export function rgbToHex(rgb: RGBColor): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Parses RGB/RGBA color string
 * @param rgbString - RGB or RGBA string (e.g., "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)")
 * @returns Validation result and parsed values
 */
export function parseRgbColor(rgbString: string): {
  isValid: boolean;
  rgb?: RGBColor;
  rgba?: RGBAColor;
  error?: string;
} {
  const rgbMatch = rgbString.match(
    /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i
  );
  const rgbaMatch = rgbString.match(
    /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/i
  );

  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const a = parseFloat(rgbaMatch[4]);

    if (
      r < 0 ||
      r > 255 ||
      g < 0 ||
      g > 255 ||
      b < 0 ||
      b > 255 ||
      a < 0 ||
      a > 1
    ) {
      return {
        isValid: false,
        error: 'RGB values must be 0-255, alpha must be 0-1',
      };
    }

    return {
      isValid: true,
      rgba: { r, g, b, a },
    };
  }

  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);

    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      return {
        isValid: false,
        error: 'RGB values must be between 0 and 255',
      };
    }

    return {
      isValid: true,
      rgb: { r, g, b },
    };
  }

  return {
    isValid: false,
    error: 'Invalid RGB format. Use rgb(r, g, b) or rgba(r, g, b, a)',
  };
}

/**
 * Converts RGB to HSL
 * @param rgb - RGB color object
 * @returns HSL color object
 */
export function rgbToHsl(rgb: RGBColor): HSLColor {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;

  let h = 0;
  let s = 0;
  const l = sum / 2;

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - sum) : diff / sum;

    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Converts HSL to RGB
 * @param hsl - HSL color object
 * @returns RGB color object
 */
export function hslToRgb(hsl: HSLColor): RGBColor {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

/**
 * Parses HSL/HSLA color string
 * @param hslString - HSL or HSLA string (e.g., "hsl(0, 100%, 50%)" or "hsla(0, 100%, 50%, 0.5)")
 * @returns Validation result and parsed values
 */
export function parseHslColor(hslString: string): {
  isValid: boolean;
  hsl?: HSLColor;
  hsla?: HSLAColor;
  error?: string;
} {
  const hslMatch = hslString.match(
    /^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)$/i
  );
  const hslaMatch = hslString.match(
    /^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d.]+)\s*\)$/i
  );

  if (hslaMatch) {
    const h = parseInt(hslaMatch[1], 10);
    const s = parseInt(hslaMatch[2], 10);
    const l = parseInt(hslaMatch[3], 10);
    const a = parseFloat(hslaMatch[4]);

    if (
      h < 0 ||
      h > 360 ||
      s < 0 ||
      s > 100 ||
      l < 0 ||
      l > 100 ||
      a < 0 ||
      a > 1
    ) {
      return {
        isValid: false,
        error: 'H must be 0-360, S and L must be 0-100%, alpha must be 0-1',
      };
    }

    return {
      isValid: true,
      hsla: { h, s, l, a },
    };
  }

  if (hslMatch) {
    const h = parseInt(hslMatch[1], 10);
    const s = parseInt(hslMatch[2], 10);
    const l = parseInt(hslMatch[3], 10);

    if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) {
      return {
        isValid: false,
        error: 'H must be between 0-360, S and L must be between 0-100%',
      };
    }

    return {
      isValid: true,
      hsl: { h, s, l },
    };
  }

  return {
    isValid: false,
    error: 'Invalid HSL format. Use hsl(h, s%, l%) or hsla(h, s%, l%, a)',
  };
}

/**
 * Formats RGB color as string
 * @param rgb - RGB color object
 * @returns RGB string
 */
export function formatRgb(rgb: RGBColor): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

/**
 * Formats RGBA color as string
 * @param rgba - RGBA color object
 * @returns RGBA string
 */
export function formatRgba(rgba: RGBAColor): string {
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`;
}

/**
 * Formats HSL color as string
 * @param hsl - HSL color object
 * @returns HSL string
 */
export function formatHsl(hsl: HSLColor): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Formats HSLA color as string
 * @param hsla - HSLA color object
 * @returns HSLA string
 */
export function formatHsla(hsla: HSLAColor): string {
  return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a})`;
}

/**
 * Gets the contrast ratio between two colors
 * @param color1 - First RGB color
 * @param color2 - Second RGB color
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: RGBColor, color2: RGBColor): number {
  const getLuminance = (rgb: RGBColor) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Determines if a color is light or dark
 * @param rgb - RGB color object
 * @returns 'light' or 'dark'
 */
export function getColorBrightness(rgb: RGBColor): 'light' | 'dark' {
  // Using the relative luminance formula
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? 'light' : 'dark';
}
