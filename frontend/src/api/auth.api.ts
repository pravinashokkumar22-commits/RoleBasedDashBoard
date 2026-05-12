import api from './axiosInstance';
import type { LoginCredentials, RegisterCredentials, ApiResponse } from '../types';

export const authApi = {
  login: (data: LoginCredentials) =>
    api.post<ApiResponse<{ token: string }>>('/auth/login', data),

  register: (data: RegisterCredentials) =>
    api.post<ApiResponse<{ id: number; email: string }>>('/auth/register', data),
};
