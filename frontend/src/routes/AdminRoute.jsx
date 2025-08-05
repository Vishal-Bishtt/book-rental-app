import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) return null;

  return auth?.user && auth.user.role === 'admin' ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
