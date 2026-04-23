import axios from 'axios';

/**
 * Axios instance pre-configured for our Spring Boot backend.
 * - baseURL points to our backend server
 * - withCredentials enables session cookies for auth
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // Send session cookies with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
