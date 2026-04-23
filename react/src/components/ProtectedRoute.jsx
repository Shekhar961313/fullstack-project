import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute - wraps pages that require login.
 * If user is not logged in, they get redirected to the login page.
 */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Still checking if user is logged in - show loading
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#636e72'
      }}>
        Loading...
      </div>
    );
  }

  // Not logged in - redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Logged in - show the protected page
  return children;
}

export default ProtectedRoute;
