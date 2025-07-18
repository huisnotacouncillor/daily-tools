import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  Upload,
  BarChart3,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  validateAndParseJson,
  formatJson,
  minifyJson,
  getJsonStats,
} from '@/lib/json-utils';

const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zipCode": "10001"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "isActive": true,
  "lastLogin": null
}`;

export function JsonFormatter() {
  const [input, setInput] = useState(sampleJson);
  const [indentSize, setIndentSize] = useState('2');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [validation, setValidation] = useState<
    ReturnType<typeof validateAndParseJson>
  >({ isValid: true });
  const [formatted, setFormatted] = useState<string>('');
  const [minified, setMinified] = useState<string>('');
  const [stats, setStats] = useState<ReturnType<typeof getJsonStats> | null>(
    null
  );

  useEffect(() => {
    // Check if dark mode is enabled
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    // Validate and process JSON
    const validationResult = validateAndParseJson(input);
    setValidation(validationResult);

    if (validationResult.isValid && validationResult.data !== undefined) {
      // Format JSON
      const formatResult = formatJson(input, parseInt(indentSize));
      if (formatResult.isValid && formatResult.formatted) {
        setFormatted(formatResult.formatted);
      }

      // Minify JSON
      const minifyResult = minifyJson(input);
      if (minifyResult.isValid && minifyResult.minified) {
        setMinified(minifyResult.minified);
      }

      // Get stats
      const jsonStats = getJsonStats(validationResult.data);
      setStats(jsonStats);
    } else {
      setFormatted('');
      setMinified('');
      setStats(null);
    }
  }, [input, indentSize]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadJson = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          JSON Parser & Formatter
        </h1>
        <p className="text-muted-foreground">
          Format, validate, and beautify JSON data with syntax highlighting.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  Input
                  {validation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept=".json,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById('file-upload')?.click()
                    }
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>Paste your raw JSON data here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="json-input">JSON Data</Label>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="indent-size" className="text-xs">
                      Indent:
                    </Label>
                    <Select value={indentSize} onValueChange={setIndentSize}>
                      <SelectTrigger className="w-16 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="8">8</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Textarea
                  id="json-input"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Enter or paste JSON data..."
                  rows={16}
                  className={`font-mono text-sm ${
                    validation.isValid ? '' : 'border-red-500'
                  }`}
                />
                {validation.error && (
                  <div className="text-sm text-red-500 flex items-start gap-1">
                    <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{validation.error}</p>
                      {validation.errorLine && validation.errorColumn && (
                        <p className="text-xs">
                          Line {validation.errorLine}, Column{' '}
                          {validation.errorColumn}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Statistics
                </CardTitle>
                <CardDescription>Analysis of your JSON data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <Badge variant="outline">{stats.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{stats.size} chars</span>
                    </div>
                    {stats.keys !== undefined && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Keys:</span>
                        <span>{stats.keys}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Depth:</span>
                      <span>{stats.depth}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Objects:</span>
                      <span>{stats.objects}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Arrays:</span>
                      <span>{stats.arrays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Strings:</span>
                      <span>{stats.strings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Numbers:</span>
                      <span>{stats.numbers}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Output Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Formatted Output</CardTitle>
              <CardDescription>
                Formatted JSON with syntax highlighting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="formatted" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="formatted">Formatted</TabsTrigger>
                  <TabsTrigger value="minified">Minified</TabsTrigger>
                </TabsList>

                <TabsContent value="formatted" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Formatted JSON</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formatted)}
                        disabled={!formatted}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          downloadJson(formatted, 'formatted.json')
                        }
                        disabled={!formatted}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md overflow-hidden">
                    {formatted ? (
                      <SyntaxHighlighter
                        language="json"
                        style={isDarkMode ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.875rem',
                          maxHeight: '400px',
                        }}
                        showLineNumbers
                      >
                        {formatted}
                      </SyntaxHighlighter>
                    ) : (
                      <div className="p-4 text-muted-foreground text-center">
                        {validation.error
                          ? 'Fix JSON errors to see formatted output'
                          : 'Enter JSON data to see formatted output'}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="minified" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Minified JSON</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(minified)}
                        disabled={!minified}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadJson(minified, 'minified.json')}
                        disabled={!minified}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="border rounded-md p-4 bg-muted/50">
                    {minified ? (
                      <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                        {minified}
                      </pre>
                    ) : (
                      <div className="text-muted-foreground text-center">
                        {validation.error
                          ? 'Fix JSON errors to see minified output'
                          : 'Enter JSON data to see minified output'}
                      </div>
                    )}
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
