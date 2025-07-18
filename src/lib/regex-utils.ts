/**
 * Validates a regular expression pattern
 * @param pattern - The regex pattern to validate
 * @returns An object containing validation result and error message if any
 */
export function validateRegexPattern(pattern: string): {
  isValid: boolean;
  error?: string;
  regex?: RegExp;
} {
  if (!pattern) {
    return { isValid: false, error: 'Pattern is empty' };
  }

  try {
    // Try to create a RegExp object
    const regex = new RegExp(pattern);
    return { isValid: true, regex };
  } catch (error) {
    return {
      isValid: false,
      error:
        error instanceof Error ? error.message : 'Invalid regular expression',
    };
  }
}

/**
 * Tests a string against a regular expression pattern
 * @param pattern - The regex pattern to test
 * @param testString - The string to test against the pattern
 * @param flags - Optional regex flags
 * @returns An object containing match results
 */
export function testRegexPattern(
  pattern: string,
  testString: string,
  flags: string = ''
): {
  isValid: boolean;
  matches: RegExpMatchArray[];
  error?: string;
} {
  if (!pattern) {
    return { isValid: false, matches: [], error: 'Pattern is empty' };
  }

  if (!testString) {
    return { isValid: true, matches: [], error: 'Test string is empty' };
  }

  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegExpMatchArray[] = [];

    // Find all matches
    let match: RegExpExecArray | null;
    while ((match = regex.exec(testString)) !== null) {
      matches.push({ ...match });

      // Prevent infinite loops for patterns like /a*/g
      if (match.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // If the regex is not global, break after first match
      if (!regex.global) break;
    }

    return { isValid: true, matches };
  } catch (error) {
    return {
      isValid: false,
      matches: [],
      error:
        error instanceof Error ? error.message : 'Invalid regular expression',
    };
  }
}

/**
 * Explains a regular expression pattern by breaking it down into components
 * @param pattern - The regex pattern to explain
 * @returns An array of explanation objects for each component
 */
export function explainRegexPattern(pattern: string): Array<{
  component: string;
  explanation: string;
}> {
  if (!pattern) {
    return [];
  }

  const explanations: Array<{ component: string; explanation: string }> = [];

  // Remove leading and trailing slashes and flags if present
  let cleanPattern = pattern;
  const flagsMatch = pattern.match(/\/([gimsuyd]*)$/);
  let flags = '';

  if (pattern.startsWith('/') && flagsMatch) {
    flags = flagsMatch[1];
    cleanPattern = pattern.slice(1, pattern.lastIndexOf('/'));
  }

  // Add explanation for flags if present
  if (flags) {
    explanations.push({
      component: `/${flags}`,
      explanation: explainFlags(flags),
    });
  }

  // Basic regex components to explain
  const components = [
    { regex: /\\d/g, explanation: 'Matches any digit (0-9)' },
    {
      regex: /\\w/g,
      explanation: 'Matches any word character (alphanumeric + underscore)',
    },
    {
      regex: /\\s/g,
      explanation:
        'Matches any whitespace character (spaces, tabs, line breaks)',
    },
    { regex: /\\b/g, explanation: 'Matches a word boundary' },
    { regex: /\\B/g, explanation: 'Matches a non-word boundary' },
    { regex: /\\n/g, explanation: 'Matches a line break' },
    { regex: /\\t/g, explanation: 'Matches a tab character' },
    { regex: /\\r/g, explanation: 'Matches a carriage return' },
    { regex: /\\f/g, explanation: 'Matches a form feed' },
    { regex: /\\v/g, explanation: 'Matches a vertical tab' },
    { regex: /\\0/g, explanation: 'Matches a NUL character' },
    { regex: /\\\\/g, explanation: 'Matches a literal backslash' },
    { regex: /\\./g, explanation: 'Matches a literal period' },
    { regex: /\\\*/g, explanation: 'Matches a literal asterisk' },
    { regex: /\\\+/g, explanation: 'Matches a literal plus sign' },
    { regex: /\\\?/g, explanation: 'Matches a literal question mark' },
    { regex: /\\\(/g, explanation: 'Matches a literal opening parenthesis' },
    { regex: /\\\)/g, explanation: 'Matches a literal closing parenthesis' },
    { regex: /\\\[/g, explanation: 'Matches a literal opening square bracket' },
    { regex: /\\\]/g, explanation: 'Matches a literal closing square bracket' },
    { regex: /\\\{/g, explanation: 'Matches a literal opening curly brace' },
    { regex: /\\\}/g, explanation: 'Matches a literal closing curly brace' },
    { regex: /\\\^/g, explanation: 'Matches a literal caret' },
    { regex: /\\\$/g, explanation: 'Matches a literal dollar sign' },
    { regex: /\\\|/g, explanation: 'Matches a literal pipe' },
    { regex: /\./g, explanation: 'Matches any character except line breaks' },
    { regex: /\^/g, explanation: 'Matches the start of a line' },
    { regex: /\$/g, explanation: 'Matches the end of a line' },
    {
      regex: /\*/g,
      explanation: 'Matches 0 or more of the preceding character',
    },
    {
      regex: /\+/g,
      explanation: 'Matches 1 or more of the preceding character',
    },
    { regex: /\?/g, explanation: 'Matches 0 or 1 of the preceding character' },
    { regex: /\|/g, explanation: 'Acts as an OR operator between expressions' },
    {
      regex: /\{(\d+)\}/g,
      explanation: 'Matches exactly n occurrences of the preceding character',
    },
    {
      regex: /\{(\d+),\}/g,
      explanation: 'Matches n or more occurrences of the preceding character',
    },
    {
      regex: /\{(\d+),(\d+)\}/g,
      explanation:
        'Matches between n and m occurrences of the preceding character',
    },
    { regex: /\(\?:/g, explanation: 'Non-capturing group' },
    { regex: /\(\?=/g, explanation: 'Positive lookahead' },
    { regex: /\(\?!/g, explanation: 'Negative lookahead' },
    { regex: /\(\?<=/g, explanation: 'Positive lookbehind' },
    { regex: /\(\?<!/g, explanation: 'Negative lookbehind' },
    { regex: /\(/g, explanation: 'Capturing group' },
    { regex: /\)/g, explanation: 'End of group' },
    { regex: /\[/g, explanation: 'Start of character class' },
    { regex: /\]/g, explanation: 'End of character class' },
    { regex: /\[^\]/g, explanation: 'Negated character class' },
    { regex: /\[a-z\]/g, explanation: 'Character range' },
  ];

  // Find and explain each component
  for (const { regex, explanation } of components) {
    const matches = cleanPattern.match(regex);
    if (matches) {
      for (const match of matches) {
        explanations.push({
          component: match,
          explanation,
        });
      }
    }
  }

  return explanations;
}

/**
 * Explains regex flags
 * @param flags - The regex flags to explain
 * @returns A string explanation of the flags
 */
function explainFlags(flags: string): string {
  const explanations: string[] = [];

  if (flags.includes('g'))
    explanations.push('g: Global search (find all matches)');
  if (flags.includes('i')) explanations.push('i: Case-insensitive search');
  if (flags.includes('m'))
    explanations.push(
      'm: Multi-line search (^ and $ match start/end of each line)'
    );
  if (flags.includes('s')) explanations.push('s: Dot (.) matches newlines');
  if (flags.includes('u')) explanations.push('u: Unicode support');
  if (flags.includes('y'))
    explanations.push('y: Sticky search (match at current position only)');
  if (flags.includes('d'))
    explanations.push('d: Generate indices for substring matches');

  return explanations.join(', ');
}

/**
 * Highlights matches in a test string
 * @param testString - The string to highlight matches in
 * @param matches - Array of regex match results
 * @returns An array of segments with match information
 */
export function highlightMatches(
  testString: string,
  matches: RegExpMatchArray[]
): Array<{
  text: string;
  isMatch: boolean;
  matchIndex?: number;
  groupIndex?: number;
}> {
  if (!testString || matches.length === 0) {
    return [{ text: testString, isMatch: false }];
  }

  const segments: Array<{
    text: string;
    isMatch: boolean;
    matchIndex?: number;
    groupIndex?: number;
  }> = [];

  let lastIndex = 0;

  // Sort matches by index
  const sortedMatches = [...matches].sort((a, b) => a.index! - b.index!);

  for (let i = 0; i < sortedMatches.length; i++) {
    const match = sortedMatches[i];
    const matchIndex = match.index!;

    // Add non-matching segment before this match
    if (matchIndex > lastIndex) {
      segments.push({
        text: testString.substring(lastIndex, matchIndex),
        isMatch: false,
      });
    }

    // Add the full match
    segments.push({
      text: match[0],
      isMatch: true,
      matchIndex: i,
    });

    // Add capturing groups if any (skip the first element which is the full match)
    for (let j = 1; j < match.length; j++) {
      if (match[j] !== undefined) {
        // We don't add segments for groups as they're already part of the full match
        // But we could add this information if needed
      }
    }

    lastIndex = matchIndex + match[0].length;
  }

  // Add any remaining text after the last match
  if (lastIndex < testString.length) {
    segments.push({
      text: testString.substring(lastIndex),
      isMatch: false,
    });
  }

  return segments;
}
