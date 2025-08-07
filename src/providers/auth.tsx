import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { authAPI, authUtils, useAuth, swrConfig } from '@/services';
import type { AuthUser, AuthContextType } from '@/types';
import { AuthContext } from '@/contexts';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 使用 SWR 获取用户信息
  const { user: authUser, isError, mutate } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (location.pathname === '/login') return;
      const token = authUtils.getAccessToken();

      if (token && authUtils.isAuthenticated()) {
        try {
          // 如果有 token，尝试获取用户信息
          const userData = await authAPI.getProfile();
          setUser(userData.data ?? null);
        } catch {
          // 如果获取用户信息失败，清除 token
          authUtils.clearTokens();
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // 当 SWR 数据更新时，同步用户状态
  useEffect(() => {
    if (authUser && authUser.data !== user) {
      setUser(authUser.data ?? null);
    } else if (isError && user !== null) {
      setUser(null);
    }
  }, [authUser, isError, user]);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    if (response.data) {
      authUtils.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      const profileResult = await authAPI.getProfile();
      if (profileResult.data) {
        setUser(profileResult.data);
      }
    }
    await mutate(); // 重新验证用户信息
    navigate('/');
  };

  const register = async (
    email: string,
    username: string,
    name: string,
    password: string
  ) => {
    const response = await authAPI.register({
      email,
      username,
      name,
      password,
    });
    if (response.data) {
      authUtils.setTokens(
        response.data.access_token,
        response.data.refresh_token
      );
      setUser(response.data.user);
    }
    await mutate(); // 重新验证用户信息
    navigate('/');
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // 即使登出 API 失败，也要清除本地状态
      console.error('Logout API error');
    } finally {
      authUtils.clearTokens();
      setUser(null);
      await mutate(undefined); // 清除 SWR 缓存
      navigate('/login');
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    if (!user) return;

    try {
      // 模拟API调用 - 在实际环境中这里应该调用后端API
      await authAPI.switchWorkspace(workspaceId);

      // 更新用户的当前workspace
      const updatedUser = {
        ...user,
        current_workspace_id: workspaceId,
      };

      setUser(updatedUser);

      // 重新验证用户信息
      await mutate();
    } catch (error) {
      console.error('Failed to switch workspace:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    switchWorkspace,
  };

  return (
    <SWRConfig value={swrConfig}>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </SWRConfig>
  );
}
