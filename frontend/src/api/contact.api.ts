import api from './axiosInstance';
import type { ContactDTO, ContactSubmission, ApiResponse } from '../types';

export const contactApi = {
  submit: (data: ContactDTO) =>
    api.post<ApiResponse<ContactSubmission>>('/contact', data),

  getAll: () =>
    api.get<ApiResponse<ContactSubmission[]>>('/contact'),
};
