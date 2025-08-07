import { useTranslation } from 'react-i18next';
import { useTheme, useAuth } from '@/hooks';
import { useState } from 'react';
import { Button } from '@ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu';
import { LogOut, User, Settings, Palette, Globe } from 'lucide-react';
import { getInitials } from '@/utils';

export function UserMenu() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [lang, setLang] = useState(i18n.language);
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {/* 主题切换 Dropdown */}
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

      {/* 语言切换 Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label={t('language')}>
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              i18n.changeLanguage('en');
              setLang('en');
              localStorage.setItem('lang', 'en');
            }}
            className={lang === 'en' ? 'font-bold' : ''}
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              i18n.changeLanguage('zh');
              setLang('zh');
              localStorage.setItem('lang', 'zh');
            }}
            className={lang === 'zh' ? 'font-bold' : ''}
          >
            中文
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* 用户菜单 Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar_url} alt={user.name} />
              <AvatarFallback>{getInitials(user.name ?? '')}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>个人资料</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>设置</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{isLoggingOut ? '登出中...' : '登出'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
