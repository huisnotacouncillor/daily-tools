import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  Braces, 
  Palette, 
  Key,
  ArrowRight
} from 'lucide-react';

const tools = [
  {
    name: 'Regular Expression Validator',
    path: '/regex',
    icon: Code,
    description: 'Test and validate regular expressions with real-time matching and visual explanations.',
    features: ['Pattern testing', 'Match highlighting', 'Regex explanation', 'Tutorial reference']
  },
  {
    name: 'JSON Parser & Formatter',
    path: '/json',
    icon: Braces,
    description: 'Format, validate, and beautify JSON data with syntax highlighting.',
    features: ['JSON validation', 'Pretty formatting', 'Syntax highlighting', 'Error detection']
  },
  {
    name: 'Color Format Converter',
    path: '/color',
    icon: Palette,
    description: 'Convert between different color formats with live preview.',
    features: ['HEX to RGB/RGBA', 'HSL conversions', 'Color preview', 'Copy to clipboard']
  },
  {
    name: 'JWT Token Decoder',
    path: '/jwt',
    icon: Key,
    description: 'Decode and inspect JWT tokens to view header, payload, and signature.',
    features: ['Token decoding', 'Header inspection', 'Payload analysis', 'Signature verification']
  }
];

export function Home() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
        <p className="text-muted-foreground">
          A collection of essential tools for developers. Clean, fast, and reliable.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          
          return (
            <Card key={tool.path} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full group-hover:bg-primary/90">
                  <Link to={tool.path} className="flex items-center justify-center space-x-2">
                    <span>Open Tool</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
