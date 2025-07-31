import { useAuthContext } from '@/hooks';
import { useUsers } from '@/services';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, User, Mail, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function TestAuth() {
  const { user, isAuthenticated, logout } = useAuthContext();
  const { users, isLoading: usersLoading, isError: usersError } = useUsers();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('testauth.title')}</h1>
        <Button onClick={handleLogout} variant="outline">
          {t('logout')}
        </Button>
      </div>

      {/* 当前用户信息 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t('testauth.currentUser')}
          </CardTitle>
          <CardDescription>{t('testauth.currentUserDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated && user ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{t('testauth.authStatus')}</Badge>
                <Badge variant="default">{t('testauth.loggedIn')}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('testauth.userId')}
                  </label>
                  <p className="text-sm font-mono bg-muted p-2 rounded">
                    {user.id}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('username')}
                  </label>
                  <p className="text-sm">{user.username}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('name')}
                  </label>
                  <p className="text-sm">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    {t('email')}
                  </label>
                  <p className="text-sm flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
              </div>
              {user.avatar_url && (
                <div className="mb-4">
                  <img
                    className="h-16 w-16 rounded-full"
                    src={user.avatar_url}
                    alt={user.name}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('testauth.notLoggedIn')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('testauth.userList')}
          </CardTitle>
          <CardDescription>{t('testauth.userListDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">{t('testauth.loading')}</span>
            </div>
          ) : usersError ? (
            <div className="text-center py-8">
              <p className="text-destructive">{t('testauth.loadFailed')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('testauth.loadFailedTip')}
              </p>
            </div>
          ) : users ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {t('testauth.total', { count: users.data?.length ?? 0 })}
                </Badge>
              </div>
              <div className="grid gap-4">
                {users.data?.map(user => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {t('testauth.noUserData')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
