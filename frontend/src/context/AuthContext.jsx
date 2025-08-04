import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    role: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      setAuth({
        user: JSON.parse(storedUser),
        token: storedToken,
        role: storedRole,
      });
    }

    setLoading(false);
  }, []);

  const login = (userData, token, role) => {
    const expiresIn = 3600; // 1 hour
    const expirationTime = new Date().getTime() + expiresIn * 1000;

    setAuth({ user: userData, token, role, expirationTime });
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
  };

  const logout = () => {
    setAuth({ user: null, token: "", role: "" });
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
