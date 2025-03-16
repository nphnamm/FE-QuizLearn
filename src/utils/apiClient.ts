import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { store } from '../../redux/store';
import { userLoggedIn, userLoggedOut } from '../../redux/features/auth/authSlice';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URI;

// Token refresh timer settings
const TOKEN_REFRESH_INTERVAL = 1000 * 60 * 2.9; // 14 minutes (typical access tokens last 15 minutes)
let tokenRefreshTimer: NodeJS.Timeout | null = null;

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling token expiration
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call the refresh token endpoint
        const refreshResponse = await axios.get(`${API_URL}/auth/refresh`, { 
          withCredentials: true 
        });
        
        if (refreshResponse.data.accessToken) {
          // Update the token in store
          store.dispatch(
            userLoggedIn({
              accessToken: refreshResponse.data.accessToken,
              user: refreshResponse.data.user || store.getState().auth.user,
            })
          );
          
          // Update Authorization header
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          
          // Restart refresh timer
          startTokenRefreshTimer();
          
          // Retry the original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh token is invalid or expired, log the user out
        store.dispatch(userLoggedOut());
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Function to start the token refresh timer
export const startTokenRefreshTimer = () => {
  // Clear any existing timer
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
  }
  
  // Set a new timer to refresh the token before it expires
  tokenRefreshTimer = setTimeout(async () => {
    const state = store.getState();
    
    // Only proceed if user is logged in
    if (state.auth.token) {
      try {
        const refreshResponse = await axios.get(`${API_URL}/auth/refresh`, { 
          withCredentials: true 
        });
        
        if (refreshResponse.data.accessToken) {
          store.dispatch(
            userLoggedIn({
              accessToken: refreshResponse.data.accessToken,
              user: refreshResponse.data.user || state.auth.user,
            })
          );
          
          // Restart the timer for the next refresh
          startTokenRefreshTimer();
        }
      } catch (error) {
        console.error('Failed to refresh token:', error);
        store.dispatch(userLoggedOut());
      }
    }
  }, TOKEN_REFRESH_INTERVAL);
};

// Stop the refresh timer (e.g., when logging out)
export const stopTokenRefreshTimer = () => {
  if (tokenRefreshTimer) {
    clearTimeout(tokenRefreshTimer);
    tokenRefreshTimer = null;
  }
};

export default apiClient; 