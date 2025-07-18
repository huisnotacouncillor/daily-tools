import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Palette, Eye, AlertCircle, Shuffle } from 'lucide-react';
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
  getColorBrightness,
  type RGBColor,
  type RGBAColor,
  type HSLAColor,
} from '@/lib/color-utils';

const presetColors = [
  { name: 'Red', hex: '#FF0000' },
  { name: 'Green', hex: '#00FF00' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Yellow', hex: '#FFFF00' },
  { name: 'Cyan', hex: '#00FFFF' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Orange', hex: '#FFA500' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Brown', hex: '#A52A2A' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
];

export function ColorConverter() {
  const [hexInput, setHexInput] = useState('#3B82F6');
  const [rgbInput, setRgbInput] = useState('');
  const [hslInput, setHslInput] = useState('');

  const [currentColor, setCurrentColor] = useState<RGBColor>({
    r: 59,
    g: 130,
    b: 246,
  });
  const [alpha, setAlpha] = useState(1);

  const [hexError, setHexError] = useState<string>('');
  const [rgbError, setRgbError] = useState<string>('');
  const [hslError, setHslError] = useState<string>('');

  // Update all formats when current color changes
  useEffect(() => {
    const hex = rgbToHex(currentColor);
    const hsl = rgbToHsl(currentColor);

    setHexInput(hex);
    setRgbInput(formatRgb(currentColor));
    setHslInput(formatHsl(hsl));

    // Clear errors when color is valid
    setHexError('');
    setRgbError('');
    setHslError('');
  }, [currentColor]);

  const handleHexChange = (value: string) => {
    setHexInput(value);
    const result = parseHexColor(value);

    if (result.isValid && result.rgb) {
      setCurrentColor(result.rgb);
      setHexError('');
    } else {
      setHexError(result.error || 'Invalid HEX color');
    }
  };

  const handleRgbChange = (value: string) => {
    setRgbInput(value);
    const result = parseRgbColor(value);

    if (result.isValid) {
      if (result.rgba) {
        setCurrentColor({
          r: result.rgba.r,
          g: result.rgba.g,
          b: result.rgba.b,
        });
        setAlpha(result.rgba.a);
      } else if (result.rgb) {
        setCurrentColor(result.rgb);
        setAlpha(1);
      }
      setRgbError('');
    } else {
      setRgbError(result.error || 'Invalid RGB color');
    }
  };

  const handleHslChange = (value: string) => {
    setHslInput(value);
    const result = parseHslColor(value);

    if (result.isValid) {
      if (result.hsla) {
        const rgb = hslToRgb({
          h: result.hsla.h,
          s: result.hsla.s,
          l: result.hsla.l,
        });
        setCurrentColor(rgb);
        setAlpha(result.hsla.a);
      } else if (result.hsl) {
        const rgb = hslToRgb(result.hsl);
        setCurrentColor(rgb);
        setAlpha(1);
      }
      setHslError('');
    } else {
      setHslError(result.error || 'Invalid HSL color');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setCurrentColor({ r, g, b });
  };

  const selectPresetColor = (hex: string) => {
    const result = parseHexColor(hex);
    if (result.isValid && result.rgb) {
      setCurrentColor(result.rgb);
    }
  };

  const brightness = getColorBrightness(currentColor);
  const contrastWithWhite = getContrastRatio(currentColor, {
    r: 255,
    g: 255,
    b: 255,
  });
  const contrastWithBlack = getContrastRatio(currentColor, {
    r: 0,
    g: 0,
    b: 0,
  });

  const hsl = rgbToHsl(currentColor);
  const rgba: RGBAColor = { ...currentColor, a: alpha };
  const hsla: HSLAColor = { ...hsl, a: alpha };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Color Format Converter
        </h1>
        <p className="text-muted-foreground">
          Convert between different color formats with live preview.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Color Input
              </CardTitle>
              <CardDescription>
                Enter color in any supported format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hex-input">HEX Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="hex-input"
                    value={hexInput}
                    onChange={e => handleHexChange(e.target.value)}
                    placeholder="#FF0000"
                    className={hexError ? 'border-red-500' : ''}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(hexInput)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {hexError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {hexError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="rgb-input">RGB/RGBA Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="rgb-input"
                    value={rgbInput}
                    onChange={e => handleRgbChange(e.target.value)}
                    placeholder="rgb(255, 0, 0)"
                    className={rgbError ? 'border-red-500' : ''}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(rgbInput)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {rgbError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {rgbError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hsl-input">HSL/HSLA Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="hsl-input"
                    value={hslInput}
                    onChange={e => handleHslChange(e.target.value)}
                    placeholder="hsl(0, 100%, 50%)"
                    className={hslError ? 'border-red-500' : ''}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(hslInput)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                {hslError && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {hslError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alpha-input">Alpha (Opacity)</Label>
                <Input
                  id="alpha-input"
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={alpha}
                  onChange={e => setAlpha(parseFloat(e.target.value) || 0)}
                  className="w-24"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={generateRandomColor}
                  variant="outline"
                  size="sm"
                >
                  <Shuffle className="h-3 w-3 mr-1" />
                  Random
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preset Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Preset Colors</CardTitle>
              <CardDescription>Click to select a preset color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {presetColors.map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => selectPresetColor(preset.hex)}
                    className="group relative aspect-square rounded-md border-2 border-border hover:border-primary transition-colors"
                    style={{ backgroundColor: preset.hex }}
                    title={`${preset.name} (${preset.hex})`}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white rounded-md">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Output Column */}
        <div className="space-y-6">
          {/* Color Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Color Preview
              </CardTitle>
              <CardDescription>Live preview of your color</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div
                  className="w-full h-32 rounded-lg border flex items-center justify-center text-lg font-medium"
                  style={{
                    backgroundColor: `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, ${alpha})`,
                    color: brightness === 'light' ? '#000000' : '#ffffff',
                  }}
                >
                  Sample Text
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Brightness:</span>
                      <Badge
                        variant={
                          brightness === 'light' ? 'default' : 'secondary'
                        }
                      >
                        {brightness}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">vs White:</span>
                      <span>{contrastWithWhite.toFixed(2)}:1</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Alpha:</span>
                      <span>{(alpha * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">vs Black:</span>
                      <span>{contrastWithBlack.toFixed(2)}:1</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Formats */}
          <Card>
            <CardHeader>
              <CardTitle>All Formats</CardTitle>
              <CardDescription>Color in different formats</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="alpha">With Alpha</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">HEX</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {rgbToHex(currentColor)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(rgbToHex(currentColor))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">RGB</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {formatRgb(currentColor)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formatRgb(currentColor))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">HSL</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {formatHsl(hsl)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formatHsl(hsl))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alpha" className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">RGBA</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {formatRgba(rgba)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formatRgba(rgba))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">HSLA</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {formatHsla(hsla)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formatHsla(hsla))}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="text-sm font-medium">HEX8</span>
                        <p className="text-xs text-muted-foreground font-mono">
                          {rgbToHex(currentColor)}
                          {Math.round(alpha * 255)
                            .toString(16)
                            .padStart(2, '0')
                            .toUpperCase()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            `${rgbToHex(currentColor)}${Math.round(alpha * 255)
                              .toString(16)
                              .padStart(2, '0')
                              .toUpperCase()}`
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
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
