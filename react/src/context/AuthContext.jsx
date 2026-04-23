import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

/**
 * AuthContext provides authentication state to the entire app.
 * Any component can check if the user is logged in and get user info.
 */
const AuthContext = createContext(null);

// Custom hook to easily access auth state from any component
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // Current logged-in user
  const [loading, setLoading] = useState(true);  // Loading state while checking session

  // On app load, check if user is already logged in (session still valid)
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function - called from Login page
  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    setUser(response.data);
    return response.data;
  };

  // Register function - called from Register page
  const register = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  };

  // Logout function
  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
