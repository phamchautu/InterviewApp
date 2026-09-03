import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { API_URL, API_ACCESS_TOKEN } from '@env';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach token from env
    if (API_ACCESS_TOKEN) {
      config.headers.Authorization = `Bearer ${API_ACCESS_TOKEN}`;
    }
    
    // Log request in dev mode
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in dev mode
    if (__DEV__) {
      console.log(`[API Response] ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle errors (e.g., global error logging, token expiration)
    if (error.response) {
      // Server responded with a status code outside of 2xx
      console.error('[API Error]', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        // Handle unauthorized access (e.g., redirect to login)
        console.warn('Unauthorized access - Token might be invalid or expired.');
      }
    } else if (error.request) {
      // No response received
      console.error('[API Error] No response received', error.request);
    } else {
      // Request setup error
      console.error('[API Error] Request setup failed', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
