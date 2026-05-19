import api from './axiosInstance';
import type { User, ApiResponse } from '../types';

export const usersApi = {

  getAll: () =>
    api.get<User[]>('/users'),

  getMe: () =>
    api.get<User>('/users/me'),

  update: (id: number, data: { name: string; email: string; password?: string }) =>
    api.put<ApiResponse<User>>(`/users/${id}`, data),

  delete: (id: number) =>
    api.delete<ApiResponse<null>>(`/users/${id}`),

};
