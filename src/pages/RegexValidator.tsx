import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
  validateRegexPattern,
  testRegexPattern,
  explainRegexPattern,
  highlightMatches,
} from '@/lib/regex-utils';

export function RegexValidator() {
  const [pattern, setPattern] = useState('\\d{3}-\\d{3}-\\d{4}');
  const [testString, setTestString] = useState(
    'Call me at 123-456-7890 or 987-654-3210'
  );
  const [flags, setFlags] = useState('g');

  const [validation, setValidation] = useState<
    ReturnType<typeof validateRegexPattern>
  >({ isValid: true });
  const [testResult, setTestResult] = useState<
    ReturnType<typeof testRegexPattern>
  >({ isValid: true, matches: [] });
  const [explanation, setExplanation] = useState<
    ReturnType<typeof explainRegexPattern>
  >([]);
  const [highlights, setHighlights] = useState<
    ReturnType<typeof highlightMatches>
  >([]);

  useEffect(() => {
    // Validate pattern
    const validationResult = validateRegexPattern(pattern);
    setValidation(validationResult);

    // Test pattern against string
    if (validationResult.isValid) {
      const testResult = testRegexPattern(pattern, testString, flags);
      setTestResult(testResult);

      // Generate highlights
      if (testResult.isValid) {
        const highlightResult = highlightMatches(
          testString,
          testResult.matches
        );
        setHighlights(highlightResult);
      }
    }

    // Generate explanation
    const explanationResult = explainRegexPattern(pattern);
    setExplanation(explanationResult);
  }, [pattern, testString, flags]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Regular Expression Validator
        </h1>
        <p className="text-muted-foreground">
          Test and validate regular expressions with real-time matching and
          explanations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Input
                {validation.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </CardTitle>
              <CardDescription>
                Enter your regex pattern and test string
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pattern">Regular Expression Pattern</Label>
                <Input
                  id="pattern"
                  value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className={validation.isValid ? '' : 'border-red-500'}
                  aria-invalid={!validation.isValid}
                  aria-describedby={
                    validation.error ? 'pattern-error' : undefined
                  }
                />
                {validation.error && (
                  <p
                    id="pattern-error"
                    className="text-sm text-red-500 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {validation.error}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="flags">Flags (optional)</Label>
                <Input
                  id="flags"
                  value={flags}
                  onChange={e => setFlags(e.target.value)}
                  placeholder="g, i, m, s, u, y, d"
                  className="w-32"
                />
                <p className="text-xs text-muted-foreground">
                  Common flags: g (global), i (case-insensitive), m (multiline)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testString">Test String</Label>
                <Textarea
                  id="testString"
                  value={testString}
                  onChange={e => setTestString(e.target.value)}
                  placeholder="Enter text to test against the pattern..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pattern Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Pattern Explanation
              </CardTitle>
              <CardDescription>Breakdown of your regex pattern</CardDescription>
            </CardHeader>
            <CardContent>
              {explanation.length > 0 ? (
                <div className="space-y-2">
                  {explanation.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="font-mono text-xs">
                        {item.component}
                      </Badge>
                      <span className="text-muted-foreground">
                        {item.explanation}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Enter a regex pattern to see its explanation
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Match Results</span>
                {testResult.isValid && (
                  <Badge
                    variant={
                      testResult.matches.length > 0 ? 'default' : 'secondary'
                    }
                  >
                    {testResult.matches.length} match
                    {testResult.matches.length !== 1 ? 'es' : ''}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Highlighted matches and detailed results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResult.error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {testResult.error}
                </p>
              )}

              {/* Highlighted Text */}
              <div className="space-y-2">
                <Label>Highlighted Text</Label>
                <div className="p-3 border rounded-md bg-muted/50 font-mono text-sm whitespace-pre-wrap">
                  {highlights.length > 0 ? (
                    highlights.map((segment, index) => (
                      <span
                        key={index}
                        className={
                          segment.isMatch
                            ? 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded'
                            : ''
                        }
                      >
                        {segment.text}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted-foreground">
                      No text to display
                    </span>
                  )}
                </div>
              </div>

              {/* Match Details */}
              {testResult.matches.length > 0 && (
                <div className="space-y-2">
                  <Label>Match Details</Label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {testResult.matches.map((match, index) => (
                      <div key={index} className="p-2 border rounded text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Match {index + 1}</span>
                          <Badge variant="outline" className="text-xs">
                            Index: {match.index}
                          </Badge>
                        </div>
                        <div className="font-mono text-xs bg-muted p-1 rounded">
                          "{match[0]}"
                        </div>
                        {match.length > 1 && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            Groups:{' '}
                            {match
                              .slice(1)
                              .map((group, i) =>
                                group !== undefined
                                  ? `$${i + 1}: "${group}"`
                                  : `$${i + 1}: undefined`
                              )
                              .join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Reference</CardTitle>
              <CardDescription>
                Common regex patterns and syntax
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="patterns" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="patterns">Patterns</TabsTrigger>
                  <TabsTrigger value="syntax">Syntax</TabsTrigger>
                </TabsList>
                <TabsContent value="patterns" className="space-y-2 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">
                        \\d+
                      </code>
                      <span className="text-muted-foreground">
                        One or more digits
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">
                        \\w+
                      </code>
                      <span className="text-muted-foreground">
                        One or more word chars
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">
                        \\s+
                      </code>
                      <span className="text-muted-foreground">
                        One or more whitespace
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">
                        [a-z]+
                      </code>
                      <span className="text-muted-foreground">
                        Lowercase letters
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">
                        [A-Z]+
                      </code>
                      <span className="text-muted-foreground">
                        Uppercase letters
                      </span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="syntax" className="space-y-2 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">.</code>
                      <span className="text-muted-foreground">
                        Any character
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">*</code>
                      <span className="text-muted-foreground">0 or more</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">+</code>
                      <span className="text-muted-foreground">1 or more</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">?</code>
                      <span className="text-muted-foreground">0 or 1</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">^</code>
                      <span className="text-muted-foreground">
                        Start of line
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-xs bg-muted px-1 rounded">$</code>
                      <span className="text-muted-foreground">End of line</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
