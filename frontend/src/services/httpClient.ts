export interface IHttpClient {
  get<T>(url: string, config?: Record<string, unknown>): Promise<T>;
  post<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T>;
  put<T>(url: string, data?: unknown, config?: Record<string, unknown>): Promise<T>;
  delete<T>(url: string, config?: Record<string, unknown>): Promise<T>;
}
