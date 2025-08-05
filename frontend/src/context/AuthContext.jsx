import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: null,
    role: null,
  });

  const [loading, setLoading] = useState(true);

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check localStorage for quick restoration
        const storedUserRaw = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("role");

        let storedUser = null;
        try {
          if (storedUserRaw && storedUserRaw !== "undefined") {
            storedUser = JSON.parse(storedUserRaw);
          }
        } catch (err) {
          console.error("Failed to parse stored user:", err);
        }

        // If we have stored data, use it temporarily
        if (storedToken && storedUser && storedRole) {
          setAuth({
            user: storedUser,
            token: storedToken,
            role: storedRole,
          });
        }

        // Then verify with server (this will check both cookies and headers)
        try {
          const response = await axios.get('/auth/verify');
          if (response.data.authenticated) {
            const { user, token } = response.data;
            setAuth({
              user: user,
              token: token,
              role: user.role,
            });
            
            // Update localStorage with fresh data
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            localStorage.setItem("role", user.role);
          }
        } catch (error) {
          // If verification fails, clear stored data
          console.log("Token verification failed, clearing auth data");
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setAuth({ user: null, token: null, role: null });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData, token, role) => {
    if (!userData || !token) {
      console.error("Missing user data or token", { userData, token, role });
      return;
    }

    const userRole = role || userData.role;
    
    setAuth({ user: userData, token, role: userRole });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side cookie
      await axios.post('/auth/logout');
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    
    // Clear local state and storage
    setAuth({ user: null, token: null, role: null });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
