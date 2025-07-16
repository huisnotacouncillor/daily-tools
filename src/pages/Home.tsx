import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Braces,
  Palette,
  Key,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Rocket,
} from "lucide-react";

const tools = [
  {
    name: "Regular Expression Validator",
    path: "/regex",
    icon: Code,
    description:
      "Test and validate regular expressions with real-time matching and visual explanations.",
    features: [
      "Pattern testing",
      "Match highlighting",
      "Regex explanation",
      "Tutorial reference",
    ],
    color: "from-blue-500 to-cyan-500",
    badge: "Popular",
  },
  {
    name: "JSON Parser & Formatter",
    path: "/json",
    icon: Braces,
    description:
      "Format, validate, and beautify JSON data with syntax highlighting.",
    features: [
      "JSON validation",
      "Pretty formatting",
      "Syntax highlighting",
      "Error detection",
    ],
    color: "from-green-500 to-emerald-500",
    badge: "Essential",
  },
  {
    name: "Color Format Converter",
    path: "/color",
    icon: Palette,
    description: "Convert between different color formats with live preview.",
    features: [
      "HEX to RGB/RGBA",
      "HSL conversions",
      "Color preview",
      "Copy to clipboard",
    ],
    color: "from-pink-500 to-rose-500",
    badge: "Creative",
  },
  {
    name: "JWT Token Decoder",
    path: "/jwt",
    icon: Key,
    description:
      "Decode and inspect JWT tokens to view header, payload, and signature.",
    features: [
      "Token decoding",
      "Header inspection",
      "Payload analysis",
      "Signature verification",
    ],
    color: "from-purple-500 to-violet-500",
    badge: "Security",
  },
];

export function Home() {
  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-12 w-full max-w-7xl mx-auto pt-2 sm:pt-4 lg:pt-6 pb-6 sm:pb-8 lg:pb-12 px-2 sm:px-0">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-ping" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Developer Tools
            </h1>
            <div className="relative">
              <Zap className="h-8 w-8 text-yellow-500 animate-bounce" />
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A collection of{" "}
            <span className="font-semibold text-primary">essential tools</span>{" "}
            for developers. Clean, fast, and reliable solutions for your
            everyday coding needs.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-green-700 dark:text-green-400 font-medium">
              Privacy First
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/20 px-3 py-1 rounded-full">
            <Rocket className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700 dark:text-blue-400 font-medium">
              Lightning Fast
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-950/20 px-3 py-1 rounded-full">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-purple-700 dark:text-purple-400 font-medium">
              No Registration
            </span>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 w-full">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <Link key={tool.path} to={tool.path} className="block">
              <Card
                className={`group relative overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br ${tool.color} p-[1px] cursor-pointer`}
              >
                <div className="bg-background rounded-xl h-full py-6">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-br ${tool.color} text-white`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {tool.name}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {tool.badge}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-base leading-relaxed mt-3">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                      {tool.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm text-muted-foreground"
                        >
                          <div
                            className={`h-2 w-2 rounded-full bg-gradient-to-r ${tool.color}`}
                          />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`w-full bg-gradient-to-r ${tool.color} text-white rounded-lg px-4 py-3 text-center font-medium transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]`}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span>Open Tool</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </div>

                {/* Hover glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}
                />
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Footer Section */}
      <div className="text-center pt-8 border-t">
        <p className="text-sm text-muted-foreground">
          All tools run entirely in your browser. Your data never leaves your
          device.
        </p>
      </div>
    </div>
  );
}
