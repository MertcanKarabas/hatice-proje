import type { IHttpClient } from '../../../services/httpClient';

export const register = (client: IHttpClient, data: { name: string; email: string; password: string }) => {
  return client.post<{ access_token: string }>('/auth/register', data);
};

export const login = (client: IHttpClient, data: { email: string; password: string }) => {
  return client.post<{ access_token: string }>('/auth/login', data);
};
