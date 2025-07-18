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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  Copy,
  Key,
  Clock,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  decodeJwt,
  isTokenExpired,
  isTokenNotYetValid,
  formatTimestamp,
  getTimeRemaining,
  getTokenAge,
  getAlgorithmDescription,
  generateSampleJwt,
  type JwtHeader,
  type JwtPayload,
} from '@/lib/jwt-utils';

export function JwtDecoder() {
  const [token, setToken] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [decodedToken, setDecodedToken] = useState<{
    header: JwtHeader;
    payload: JwtPayload;
    signature: string;
  } | null>(null);

  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if dark mode is enabled
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  useEffect(() => {
    if (!token) {
      setDecodedToken(null);
      setError('');
      return;
    }

    const result = decodeJwt(token);

    if (result.isValid && result.decoded) {
      setDecodedToken(result.decoded);
      setError('');
    } else {
      setDecodedToken(null);
      setError(result.error || 'Failed to decode token');
    }
  }, [token]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const loadSampleToken = () => {
    setToken(generateSampleJwt());
  };

  const isExpired = decodedToken?.payload
    ? isTokenExpired(decodedToken.payload)
    : false;
  const isNotYetValid = decodedToken?.payload
    ? isTokenNotYetValid(decodedToken.payload)
    : false;
  const timeRemaining = decodedToken?.payload
    ? getTimeRemaining(decodedToken.payload)
    : '';
  const tokenAge = decodedToken?.payload
    ? getTokenAge(decodedToken.payload)
    : '';

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">JWT Token Decoder</h1>
        <p className="text-muted-foreground">
          Decode and inspect JWT tokens to view header, payload, and signature.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  JWT Token Input
                </div>
                <Button variant="outline" size="sm" onClick={loadSampleToken}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Load Sample
                </Button>
              </CardTitle>
              <CardDescription>Paste your JWT token here</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                rows={6}
                className={`font-mono text-sm ${error ? 'border-red-500' : ''}`}
              />
              {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {error}
                </p>
              )}

              {decodedToken && (
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={isExpired ? 'destructive' : 'default'}>
                      {isExpired ? 'Expired' : 'Valid'}
                    </Badge>
                    {isNotYetValid && (
                      <Badge variant="secondary">Not Yet Valid</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Age:</span>
                      <span>{tokenAge}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Expires:</span>
                      <span>{timeRemaining}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Output Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Decoded Information</CardTitle>
              <CardDescription>
                Header, payload, and signature details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {decodedToken ? (
                <Tabs defaultValue="payload" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="header">Header</TabsTrigger>
                    <TabsTrigger value="payload">Payload</TabsTrigger>
                    <TabsTrigger value="signature">Signature</TabsTrigger>
                  </TabsList>

                  <TabsContent value="header" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Header</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(decodedToken.header, null, 2)
                          )
                        }
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <SyntaxHighlighter
                        language="json"
                        style={isDarkMode ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.875rem',
                          maxHeight: '300px',
                        }}
                      >
                        {JSON.stringify(decodedToken.header, null, 2)}
                      </SyntaxHighlighter>
                    </div>

                    {decodedToken.header.alg && (
                      <div className="p-3 bg-muted/50 rounded-md text-sm">
                        <p className="font-medium">
                          Algorithm: {decodedToken.header.alg}
                        </p>
                        <p className="text-muted-foreground text-xs mt-1">
                          {getAlgorithmDescription(decodedToken.header.alg)}
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="payload" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Payload</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            JSON.stringify(decodedToken.payload, null, 2)
                          )
                        }
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    <div className="border rounded-md overflow-hidden">
                      <SyntaxHighlighter
                        language="json"
                        style={isDarkMode ? oneDark : oneLight}
                        customStyle={{
                          margin: 0,
                          fontSize: '0.875rem',
                          maxHeight: '300px',
                        }}
                      >
                        {JSON.stringify(decodedToken.payload, null, 2)}
                      </SyntaxHighlighter>
                    </div>

                    <div className="space-y-2">
                      {decodedToken.payload.exp && (
                        <div className="flex justify-between p-2 border rounded text-sm">
                          <span className="text-muted-foreground">
                            Expiration (exp):
                          </span>
                          <span>
                            {formatTimestamp(decodedToken.payload.exp)}
                          </span>
                        </div>
                      )}

                      {decodedToken.payload.iat && (
                        <div className="flex justify-between p-2 border rounded text-sm">
                          <span className="text-muted-foreground">
                            Issued At (iat):
                          </span>
                          <span>
                            {formatTimestamp(decodedToken.payload.iat)}
                          </span>
                        </div>
                      )}

                      {decodedToken.payload.nbf && (
                        <div className="flex justify-between p-2 border rounded text-sm">
                          <span className="text-muted-foreground">
                            Not Before (nbf):
                          </span>
                          <span>
                            {formatTimestamp(decodedToken.payload.nbf)}
                          </span>
                        </div>
                      )}

                      {decodedToken.payload.sub && (
                        <div className="flex justify-between p-2 border rounded text-sm">
                          <span className="text-muted-foreground">
                            Subject (sub):
                          </span>
                          <span className="font-mono">
                            {decodedToken.payload.sub}
                          </span>
                        </div>
                      )}

                      {decodedToken.payload.iss && (
                        <div className="flex justify-between p-2 border rounded text-sm">
                          <span className="text-muted-foreground">
                            Issuer (iss):
                          </span>
                          <span className="font-mono">
                            {decodedToken.payload.iss}
                          </span>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="signature" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Signature</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(decodedToken.signature)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>

                    <div className="p-3 border rounded-md bg-muted/50">
                      <p className="font-mono text-sm break-all">
                        {decodedToken.signature}
                      </p>
                    </div>

                    <div className="p-3 bg-muted/50 rounded-md text-sm">
                      <p className="text-muted-foreground">
                        The signature is used to verify that the sender of the
                        JWT is who it says it is and to ensure that the message
                        wasn't changed along the way.
                      </p>
                      <p className="text-muted-foreground mt-2">
                        Note: This tool only decodes the token and does not
                        verify the signature.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Token Decoded</h3>
                  <p className="text-muted-foreground mt-2">
                    Enter a JWT token in the input field to see the decoded
                    information.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={loadSampleToken}
                    className="mt-4"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Load Sample Token
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
