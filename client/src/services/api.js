import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_KEY = process.env.REACT_APP_API_KEY;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

// Add request interceptor for loading states
api.interceptors.request.use(
  (config) => {
    // Add any request preprocessing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors (401, 403, 500, etc.)
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized - check API key');
          break;
        case 403:
          console.error('Forbidden');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('API error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

export const thinkingRequest = async (prompt) => {
  try {
    const response = await api.post('/api/chat/thinking', { prompt });
    return response;
  } catch (error) {
    console.error('Thinking request failed:', error);
    throw error;
  }
};

export const codingRequest = async (prompt) => {
  try {
    const response = await api.post('/api/chat/coding', { prompt });
    return response;
  } catch (error) {
    console.error('Coding request failed:', error);
    throw error;
  }
};

export default api;