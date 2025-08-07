import useSWR, { type SWRConfiguration } from 'swr';
import type {
  ApiError,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthUser,
  LoginResponse,
  ApiResponse,
  Team,
  Project,
  CreateProjectForm,
} from '@/types';
import type { CreateTeamForm } from '@/types/team';

// API 基础配置
const API_BASE_URL = 'http://localhost:8000';

// 通用 fetcher 函数
const fetcher = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as ApiError;
    error.message = await response.text();
    error.status = response.status;
    throw error;
  }

  return response.json();
};

// 带认证的 fetcher
const authFetcher = async (url: string, options?: RequestInit) => {
  const token = localStorage.getItem('access_token');

  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = new Error(
      'An error occurred while fetching the data.'
    ) as ApiError;
    error.message = await response.text();
    error.status = response.status;
    throw error;
  }

  return response.json();
};

// SWR 配置
export const swrConfig: SWRConfiguration = {
  fetcher: authFetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
};

// 认证相关 API
export const authAPI = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<LoginResponse>> => {
    return fetcher('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<ApiResponse<LoginResponse>> => {
    return fetcher('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    await fetcher('/auth/logout', {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  },

  getProfile: async (): Promise<ApiResponse<AuthUser>> => {
    return authFetcher('/auth/profile');
  },

  switchWorkspace: async (workspaceId: string): Promise<ApiResponse<void>> => {
    return authFetcher(`/auth/switch-workspace`, {
      method: 'POST',
      body: JSON.stringify({ workspace_id: workspaceId }),
    });
  },
};

// 用户相关 API
export const userAPI = {
  getUsers: async (): Promise<AuthUser[]> => {
    return authFetcher('/users');
  },
};

// 项目相关 API
export const projectAPI = {
  getProjects: async (
    workspaceId: string
  ): Promise<ApiResponse<{ projects: Project[]; total: number }>> => {
    return authFetcher(`/projects?workspace_id=${workspaceId}`);
  },
  createProject: async (
    project: CreateProjectForm
  ): Promise<ApiResponse<Project>> => {
    return authFetcher('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },
};

// 团队相关 API
export const teamAPI = {
  getTeams: async (workspaceId: string): Promise<ApiResponse<Team[]>> => {
    return authFetcher(`/teams?workspace_id=${workspaceId}`);
  },
  createTeam: async (team: CreateTeamForm): Promise<ApiResponse<Team>> => {
    return authFetcher('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  },
};

// Issue 相关 API
export const issueAPI = {
  getIssuePriorities: async (): Promise<ApiResponse<string[]>> => {
    return authFetcher('/issues/priorities');
  },
};

// 标签相关 API
export const labelAPI = {
  getLabels: async (): Promise<ApiResponse<string[]>> => {
    return authFetcher('/labels');
  },
};

// SWR hooks
export const useAuth = () => {
  const { data, error, mutate } = useSWR<ApiResponse<AuthUser>>(
    authUtils.isAuthenticated() ? '/auth/profile' : null,
    authFetcher,
    {
      ...swrConfig,
      revalidateOnMount: false,
      revalidateOnFocus: false,
      dedupingInterval: 10000, // 10秒内不重复请求
    }
  );

  return {
    user: data,
    isLoading: authUtils.isAuthenticated() && !error && !data,
    isError: error,
    mutate,
  };
};

export const useUsers = () => {
  const { data, error, mutate } = useSWR<ApiResponse<AuthUser[]>>(
    '/users',
    authFetcher,
    swrConfig
  );

  return {
    users: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

// 认证工具函数
export const authUtils = {
  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  getAccessToken: () => {
    return localStorage.getItem('access_token');
  },

  getRefreshToken: () => {
    return localStorage.getItem('refresh_token');
  },

  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};
