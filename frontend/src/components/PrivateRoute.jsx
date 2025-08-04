import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  // If not logged in, redirect to login page
  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  // Else show the protected component
  return children;
};

export default PrivateRoute;
