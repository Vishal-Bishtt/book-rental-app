import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try { 
      await axios.post("/auth/register", formData); 
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <style>
        {`
          .register-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
            background-color: #f8fafc;
          }
          .register-form {
            width: 100%;
            max-width: 400px;
            padding: 2.5rem;
            border-radius: 12px;
            background: white;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          }
          .register-form h2 {
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
          }
          button[type="submit"]:hover {
            background-color: #1a1a1a;
          }
          button[type="submit"]:disabled {
            background-color: #94a3b8;
            cursor: not-allowed;
          }
          .login-link {
            margin-top: 20px;
            text-align: center;
            color: #64748b;
            font-size: 14px;
          }
          .login-button {
            background: none;
            border: none;
            color: #000000;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            margin-left: 4px;
          }
          .login-button:hover {
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
      <div className="register-form">
        <h2>Create Account</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <div className="login-link">
          Already have an account?
          <button
            className="login-button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
