import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {auth?.user?.name || "User"} 👋</h1>
      <p>Email: {auth?.user?.email}</p>

      <div style={{ marginTop: "20px" }}>
        <Link to="/books">📚 View Available Books</Link>
        <br />
        <Link to="/my-rentals">📦 My Rentals</Link>
        <br />
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </div>
  );
};

export default Dashboard;
