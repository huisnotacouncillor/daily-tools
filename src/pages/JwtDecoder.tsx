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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  Copy,
  Key,
  Clock,
  Calendar,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
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
  type JwtHeader,
  type JwtPayload,
} from '@/lib/jwt-utils';

export function JwtDecoder() {
  // Decoder state
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [decodedToken, setDecodedToken] = useState<{
    header: JwtHeader;
    payload: JwtPayload;
    signature: string;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const [signatureValid, setSignatureValid] = useState<boolean | null>(null);

  // Encoder state
  const [headerText, setHeaderText] = useState('');
  const [payloadText, setPayloadText] = useState('');
  const [encoderSecret, setEncoderSecret] = useState('your-256-bit-secret');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [encodedToken, setEncodedToken] = useState('');
  const [encoderError, setEncoderError] = useState('');

  useEffect(() => {
    // Check if dark mode is enabled
    setIsDarkMode(document.documentElement.classList.contains('dark'));

    // Initialize encoder with default values
    const defaultHeader = getDefaultJwtHeader();
    const defaultPayload = getDefaultJwtPayload();
    setHeaderText(JSON.stringify(defaultHeader, null, 2));
    setPayloadText(JSON.stringify(defaultPayload, null, 2));
  }, []);

  // Decoder logic
  useEffect(() => {
    if (!token) {
      setDecodedToken(null);
      setError('');
      setSignatureValid(null);
      return;
    }

    const result = decodeJwt(token);

    if (result.isValid && result.decoded) {
      setDecodedToken(result.decoded);
      setError('');

      // Verify signature if secret is provided
      if (secret) {
        const verification = verifyJwtSignature(token, secret);
        setSignatureValid(verification.isValid);
      } else {
        setSignatureValid(null);
      }
    } else {
      setDecodedToken(null);
      setError(result.error || 'Failed to decode token');
      setSignatureValid(null);
    }
  }, [token, secret]);

  // Encoder logic
  useEffect(() => {
    if (!headerText || !payloadText) {
      setEncodedToken('');
      setEncoderError('');
      return;
    }

    try {
      const header = JSON.parse(headerText) as JwtHeader;
      const payload = JSON.parse(payloadText) as JwtPayload;

      if (encoderSecret) {
        const encoded = encodeJwt(header, payload, encoderSecret, algorithm);
        setEncodedToken(encoded);
        setEncoderError('');
      } else {
        setEncodedToken('');
        setEncoderError('Secret is required for encoding');
      }
    } catch (err) {
      setEncodedToken('');
      setEncoderError(
        err instanceof Error ? err.message : 'Invalid JSON format'
      );
    }
  }, [headerText, payloadText, encoderSecret, algorithm]);

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

  const loadEncoderExample = () => {
    const defaultHeader = getDefaultJwtHeader();
    const defaultPayload = getDefaultJwtPayload();
    setHeaderText(JSON.stringify(defaultHeader, null, 2));
    setPayloadText(JSON.stringify(defaultPayload, null, 2));
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
        <h1 className="text-3xl font-bold tracking-tight">JWT Debugger</h1>
        <p className="text-muted-foreground">
          Decode, verify, and generate JSON Web Tokens, which are an open,
          industry standard RFC 7519 method for representing claims securely
          between two parties.
        </p>
        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md text-sm">
          <p className="text-blue-800 dark:text-blue-200">
            <strong>
              For your protection, all JWT debugging and validation happens in
              the browser.
            </strong>{' '}
            Be careful where you paste or share JWTs as they can represent
            credentials that grant access to resources.
          </p>
        </div>
      </div>

      <Tabs defaultValue="decoder" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="decoder" className="cursor-pointer">
            JWT Decoder
          </TabsTrigger>
          <TabsTrigger value="encoder" className="cursor-pointer">
            JWT Encoder
          </TabsTrigger>
        </TabsList>

        {/* JWT Decoder Tab */}
        <TabsContent value="decoder" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Encoded JWT
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadSampleToken}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Generate example
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Paste a JWT below that you'd like to decode, validate, and
                    verify.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    rows={8}
                    className={`font-mono text-sm ${error ? 'border-red-500' : decodedToken ? 'border-green-500' : ''}`}
                  />

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-800 dark:text-red-200">
                        {error}
                      </span>
                    </div>
                  )}

                  {decodedToken && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={isExpired ? 'destructive' : 'default'}>
                          {isExpired ? 'Expired' : 'Valid JWT'}
                        </Badge>
                        {signatureValid !== null && (
                          <Badge
                            variant={signatureValid ? 'default' : 'destructive'}
                          >
                            {signatureValid
                              ? 'Signature Verified'
                              : 'Invalid Signature'}
                          </Badge>
                        )}
                        {isNotYetValid && (
                          <Badge variant="secondary">Not Yet Valid</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Age:</span>
                          <span>{tokenAge}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Expires:
                          </span>
                          <span>{timeRemaining}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* JWT Signature Verification */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    JWT Signature Verification (Optional)
                  </CardTitle>
                  <CardDescription>
                    Enter the secret used to sign the JWT below:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={secret}
                        onChange={e => setSecret(e.target.value)}
                        placeholder="your-256-bit-secret"
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(secret)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {signatureValid !== null && (
                    <div
                      className={`flex items-center gap-2 p-3 rounded-md ${
                        signatureValid
                          ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800'
                      }`}
                    >
                      {signatureValid ? (
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`text-sm ${
                          signatureValid
                            ? 'text-green-800 dark:text-green-200'
                            : 'text-red-800 dark:text-red-200'
                        }`}
                      >
                        {signatureValid ? 'Valid secret' : 'Invalid secret'}
                      </span>
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
                    <Tabs defaultValue="header" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="header">Decoded Header</TabsTrigger>
                        <TabsTrigger value="payload">
                          Decoded Payload
                        </TabsTrigger>
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
                            onClick={() =>
                              copyToClipboard(decodedToken.signature)
                            }
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
                            The signature is used to verify that the sender of
                            the JWT is who it says it is and to ensure that the
                            message wasn't changed along the way.
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
                        Generate example
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* JWT Encoder Tab */}
        <TabsContent value="encoder" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      JWT Configuration
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadEncoderExample}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Load Example
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Configure the header and payload for your JWT
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Header</Label>
                    <Textarea
                      value={headerText}
                      onChange={e => setHeaderText(e.target.value)}
                      placeholder='{"alg": "HS256", "typ": "JWT"}'
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payload</Label>
                    <Textarea
                      value={payloadText}
                      onChange={e => setPayloadText(e.target.value)}
                      placeholder='{"sub": "1234567890", "name": "John Doe", "iat": 1516239022}'
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </div>

                  {encoderError && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-800 dark:text-red-200">
                        {encoderError}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Signing Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure the algorithm and secret for signing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Algorithm</Label>
                    <Select value={algorithm} onValueChange={setAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getSupportedAlgorithms().map(alg => (
                          <SelectItem key={alg} value={alg}>
                            {alg} - {getAlgorithmDescription(alg)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={encoderSecret}
                        onChange={e => setEncoderSecret(e.target.value)}
                        placeholder="your-256-bit-secret"
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(encoderSecret)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Generated JWT</CardTitle>
                  <CardDescription>Your encoded JWT token</CardDescription>
                </CardHeader>
                <CardContent>
                  {encodedToken ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Encoded JWT</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(encodedToken)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>

                      <div className="p-3 border rounded-md bg-muted/50">
                        <p className="font-mono text-sm break-all">
                          {encodedToken}
                        </p>
                      </div>

                      <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <span className="text-sm text-green-800 dark:text-green-200 font-medium">
                            JWT Successfully Generated
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                          You can now copy and use this JWT token for
                          authentication or testing purposes.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Key className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">
                        No Token Generated
                      </h3>
                      <p className="text-muted-foreground mt-2">
                        Configure the header, payload, and secret to generate a
                        JWT token.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadEncoderExample}
                        className="mt-4"
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Load Example
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
