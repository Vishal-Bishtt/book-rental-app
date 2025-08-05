import React, { useState, useEffect } from 'react'; // Make sure to import useEffect
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

const Login = () => {
  const { login, auth } = useAuth(); // Get currentUser from your context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // This useEffect will run whenever currentUser changes
  useEffect(() => {
    // If a user is logged in, redirect them to the home page
    if (auth?.user) {
      navigate("/");
    }
  }, [auth?.user, navigate]); // Dependencies array

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      const res = await axios.post("/auth/login", formData);
      
      // The backend now returns { token, user, message }
      const { token, user } = res.data;
      
      if (token && user) {
        // Update auth context with user data
        login(user, token, user.role);
        navigate("/"); // Navigate to home page after successful login
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
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
          }
          button[type="submit"]:hover {
            background-color: #1a1a1a;
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
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
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
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Sign In</button>
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
