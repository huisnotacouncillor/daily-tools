import type { Team } from './team';
import type { Workspace } from './workspace';

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    name: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// 用户类型
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url?: string;
  current_workspace_id: string;
  workspaces: Workspace[];
  teams: Team[];
}

// 认证响应类型
export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}
