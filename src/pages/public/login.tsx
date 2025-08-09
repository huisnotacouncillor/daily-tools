import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks';
import { Palette, Globe } from 'lucide-react';
import { Button } from '@ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { LoginForm, RegisterForm } from '@/features/auth';

export function Login() {
  const { t, i18n } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState(i18n.language);

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      {/* 顶部右上角主题/语言切换 */}
      <div className="fixed top-4 right-4 flex gap-2 z-10">
        {/* 主题切换 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('theme')}>
              <Palette className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setTheme('light')}
              className={theme === 'light' ? 'font-bold' : ''}
            >
              {t('light')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('dark')}
              className={theme === 'dark' ? 'font-bold' : ''}
            >
              {t('dark')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme('system')}
              className={theme === 'system' ? 'font-bold' : ''}
            >
              {t('system')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* 语言切换 */}
        <button
          className={`p-2 rounded-full border ${lang === 'en' ? 'bg-muted' : ''}`}
          title={t('language')}
          onClick={() => {
            const nextLang = lang === 'en' ? 'zh' : 'en';
            i18n.changeLanguage(nextLang);
            setLang(nextLang);
            localStorage.setItem('lang', nextLang);
          }}
        >
          <Globe className="h-5 w-5" />
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Momentum</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? t('auth.login.subtitle') : t('auth.register.subtitle')}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isLogin ? t('auth.login.title') : t('auth.register.title')}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? t('auth.login.description')
                : t('auth.register.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {isLogin ? (
              <LoginForm
                onSwitchToRegister={() => setIsLogin(false)}
                onError={handleError}
              />
            ) : (
              <RegisterForm
                onSwitchToLogin={() => setIsLogin(true)}
                onError={handleError}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
