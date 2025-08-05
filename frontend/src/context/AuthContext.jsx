import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
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
    let isMounted = true;
    
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
        if (storedToken && storedUser && storedRole && isMounted) {
          setAuth({
            user: storedUser,
            token: storedToken,
            role: storedRole,
          });
        }

        // Skip server verification for now to prevent loops
        // We'll only verify on login, not on every app load
        
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuthStatus();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback((userData, token, role) => {
    if (!userData || !token) {
      console.error("Missing user data or token", { userData, token, role });
      return;
    }

    const userRole = role || userData.role;
    
    setAuth({ user: userData, token, role: userRole });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", userRole);
  }, []);

  const logout = useCallback(async () => {
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
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    auth,
    login,
    logout,
    loading
  }), [auth, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
