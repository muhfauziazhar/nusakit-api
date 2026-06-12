export type Env = {
  DB: D1Database;
  KV: KVNamespace;
  API_VERSION: string;
  CORS_ORIGIN: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    timestamp: string;
    version: string;
  };
};

export function ok<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: { timestamp: new Date().toISOString(), version: '1.0.0' },
  };
}

export function fail(message: string): ApiResponse<null> {
  return {
    success: false,
    error: message,
    meta: { timestamp: new Date().toISOString(), version: '1.0.0' },
  };
}
