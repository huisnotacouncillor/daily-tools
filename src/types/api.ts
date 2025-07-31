// API错误类型
export interface ApiError extends Error {
  status?: number;
}

// 通用API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  meta?: any;
  errors?: any[];
  timestamp: string;
}

// 分页响应类型
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
