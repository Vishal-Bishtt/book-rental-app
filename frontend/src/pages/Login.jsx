import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Login = () => {
  const { login, auth } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError("Google Sign-in failed. Please try again.");
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(user, token, user.role);
        navigate("/");
      } catch (err) {
        console.error("Error parsing OAuth callback data:", err);
        setError("Authentication error. Please try again.");
      }
    }
  }, [searchParams, login, navigate]);

  // Redirect if already logged in
  useEffect(() => {
    if (auth?.user) {
      navigate("/");
    }
  }, [auth?.user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await axios.post("/auth/login", formData);
      
      const { token, user } = res.data;
      
      if (token && user) {
        login(user, token, user.role);
        navigate("/");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div className="login-container">
      <style>
        {`
          .login-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            background-color: #f8fafc;
          }
          .login-form {
            width: 100%;
            max-width: 400px;
            padding: 2.5rem;
            border-radius: 12px;
            background: white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          .login-form h2 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 24px;
            color: #0f172a;
          }
          .form-group {
            margin-bottom: 16px;
          }
          .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #475569;
            font-size: 14px;
          }
          input {
            width: 100%;
            padding: 12px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            margin-bottom: 16px;
            box-sizing: border-box;
          }
          input:focus {
            outline: none;
            border-color: #94a3b8;
          }
          button[type="submit"] {
            width: 100%;
            padding: 12px;
            background-color: #000000;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-bottom: 16px;
          }
          button[type="submit"]:hover {
            background-color: #1a1a1a;
          }
          button[type="submit"]:disabled {
            background-color: #94a3b8;
            cursor: not-allowed;
          }
          .google-signin-btn {
            width: 100%;
            padding: 12px;
            background-color: #ffffff;
            color: #333333;
            border: 1px solid #dadce0;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, box-shadow 0.2s;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .google-signin-btn:hover {
            background-color: #f8f9fa;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .divider {
            text-align: center;
            margin: 20px 0;
            position: relative;
            color: #64748b;
            font-size: 14px;
          }
          .divider:before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: #e2e8f0;
          }
          .divider span {
            background-color: white;
            padding: 0 16px;
          }
          .signup-link {
            margin-top: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
          }
          .signup-button {
            background: none;
            border: none;
            color: #000000;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            margin-left: 4px;
          }
          .signup-button:hover {
            text-decoration: underline;
          }
          .error {
            color: #ef4444;
            font-size: 14px;
            margin-bottom: 16px;
            text-align: center;
          }
        `}
      </style>
      <div className="login-form">
        <h2>Sign In</h2>
        {error && <p className="error">{error}</p>}
        
        {/* Google Sign-in Button */}
        <button 
          type="button" 
          className="google-signin-btn"
          onClick={handleGoogleSignIn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        {/* Traditional Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="signup-link">
          Need an account?
          <button
            className="signup-button"
            onClick={() => navigate("/register")}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
