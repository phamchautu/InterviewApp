import apiClient from '@/services/apiClient';

/**
 * Base API service to handle common HTTP methods.
 */
export const api = {
  get: <T>(url: string, params?: object) => apiClient.get<T>(url, { params }),
  post: <T>(url: string, data?: object) => apiClient.post<T>(url, data),
  put: <T>(url: string, data?: object) => apiClient.put<T>(url, data),
  patch: <T>(url: string, data?: object) => apiClient.patch<T>(url, data),
  delete: <T>(url: string) => apiClient.delete<T>(url),
};
