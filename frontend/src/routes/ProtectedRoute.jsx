// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useAuth();

  if (loading) return null;

  return auth?.user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

