/**
 * Validates and parses JSON string
 * @param jsonString - The JSON string to validate and parse
 * @returns An object containing validation result, parsed data, and error message if any
 */
export function validateAndParseJson(jsonString: string): {
  isValid: boolean;
  data?: unknown;
  error?: string;
  errorLine?: number;
  errorColumn?: number;
} {
  if (!jsonString.trim()) {
    return { isValid: false, error: "JSON string is empty" };
  }

  try {
    const data = JSON.parse(jsonString);
    return { isValid: true, data };
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Try to extract line and column information from the error message
      const match = error.message.match(/at position (\d+)/);
      if (match) {
        const position = parseInt(match[1], 10);
        const { line, column } = getLineAndColumn(jsonString, position);
        return {
          isValid: false,
          error: error.message,
          errorLine: line,
          errorColumn: column,
        };
      }
    }

    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid JSON",
    };
  }
}

/**
 * Formats JSON string with proper indentation
 * @param jsonString - The JSON string to format
 * @param indent - Number of spaces for indentation (default: 2)
 * @returns An object containing the formatted JSON and any errors
 */
export function formatJson(
  jsonString: string,
  indent: number = 2
): {
  isValid: boolean;
  formatted?: string;
  error?: string;
} {
  const parseResult = validateAndParseJson(jsonString);

  if (!parseResult.isValid) {
    return {
      isValid: false,
      error: parseResult.error,
    };
  }

  try {
    const formatted = JSON.stringify(parseResult.data, null, indent);
    return { isValid: true, formatted };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Failed to format JSON",
    };
  }
}

/**
 * Minifies JSON string by removing unnecessary whitespace
 * @param jsonString - The JSON string to minify
 * @returns An object containing the minified JSON and any errors
 */
export function minifyJson(jsonString: string): {
  isValid: boolean;
  minified?: string;
  error?: string;
} {
  const parseResult = validateAndParseJson(jsonString);

  if (!parseResult.isValid) {
    return {
      isValid: false,
      error: parseResult.error,
    };
  }

  try {
    const minified = JSON.stringify(parseResult.data);
    return { isValid: true, minified };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Failed to minify JSON",
    };
  }
}

/**
 * Gets statistics about the JSON data
 * @param data - The parsed JSON data
 * @returns An object containing various statistics
 */
export function getJsonStats(data: unknown): {
  type: string;
  size: number;
  keys?: number;
  depth: number;
  arrays?: number;
  objects?: number;
  nulls?: number;
  booleans?: number;
  numbers?: number;
  strings?: number;
} {
  const stats: {
    type: string;
    size: number;
    keys?: number;
    depth: number;
    arrays: number;
    objects: number;
    nulls: number;
    booleans: number;
    numbers: number;
    strings: number;
  } = {
    type: getDataType(data),
    size: JSON.stringify(data).length,
    depth: getMaxDepth(data, 0),
    arrays: 0,
    objects: 0,
    nulls: 0,
    booleans: 0,
    numbers: 0,
    strings: 0,
  };

  // Count different types
  countTypes(data, stats);

  // Add keys count for objects
  if (typeof data === "object" && data !== null && !Array.isArray(data)) {
    stats.keys = Object.keys(data).length;
  }

  return stats;
}

/**
 * Gets the data type of a value
 * @param value - The value to check
 * @returns The type as a string
 */
function getDataType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

/**
 * Calculates the maximum depth of nested objects/arrays
 * @param obj - The object to analyze
 * @param currentDepth - Current depth level
 * @returns The maximum depth
 */
function getMaxDepth(obj: unknown, currentDepth: number = 0): number {
  if (typeof obj !== "object" || obj === null) {
    return currentDepth;
  }

  let maxDepth = currentDepth;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      maxDepth = Math.max(maxDepth, getMaxDepth(item, currentDepth + 1));
    }
  } else {
    for (const value of Object.values(obj)) {
      maxDepth = Math.max(maxDepth, getMaxDepth(value, currentDepth + 1));
    }
  }

  return maxDepth;
}

/**
 * Counts different types in the JSON data
 * @param data - The data to analyze
 * @param stats - The stats object to update
 */
function countTypes(
  data: unknown,
  stats: {
    arrays: number;
    objects: number;
    nulls: number;
    booleans: number;
    numbers: number;
    strings: number;
  }
): void {
  if (data === null) {
    stats.nulls++;
  } else if (typeof data === "boolean") {
    stats.booleans++;
  } else if (typeof data === "number") {
    stats.numbers++;
  } else if (typeof data === "string") {
    stats.strings++;
  } else if (Array.isArray(data)) {
    stats.arrays++;
    for (const item of data) {
      countTypes(item, stats);
    }
  } else if (typeof data === "object") {
    stats.objects++;
    for (const value of Object.values(data)) {
      countTypes(value, stats);
    }
  }
}

/**
 * Gets line and column number from character position
 * @param text - The text to analyze
 * @param position - The character position
 * @returns Line and column numbers (1-based)
 */
function getLineAndColumn(
  text: string,
  position: number
): { line: number; column: number } {
  const lines = text.substring(0, position).split("\n");
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

/**
 * Escapes special characters in JSON strings for display
 * @param str - The string to escape
 * @returns The escaped string
 */
export function escapeJsonString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\f/g, "\\f")
    .replace(/[\b]/g, "\\b");
}

/**
 * Converts various data formats to JSON
 * @param input - The input string in various formats
 * @param format - The input format ('auto', 'yaml', 'xml', 'csv')
 * @returns Converted JSON or error
 */
export function convertToJson(
  input: string,
  format: string = "auto"
): {
  isValid: boolean;
  json?: string;
  error?: string;
} {
  if (!input.trim()) {
    return { isValid: false, error: "Input is empty" };
  }

  // For now, we'll just handle JSON input
  // In a real implementation, you might add YAML, XML, CSV parsers
  if (format === "auto" || format === "json") {
    const result = validateAndParseJson(input);
    if (result.isValid) {
      return {
        isValid: true,
        json: JSON.stringify(result.data, null, 2),
      };
    } else {
      return {
        isValid: false,
        error: result.error,
      };
    }
  }

  return {
    isValid: false,
    error: `Format '${format}' is not supported yet`,
  };
}
