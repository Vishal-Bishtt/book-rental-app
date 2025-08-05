import React from 'react';
import { Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const { auth, logout, loading } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (loading) return null; // Don’t render until auth state is restored from localStorage

  return (
    <>
      <style>
        {`
          .nav-component {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            z-index: 1000 !important;
            width: 100% !important;
            font-family: system-ui, -apple-system, sans-serif !important;
          }
          
          .nav-component .nav-component__container {
            background-color: white !important;
            padding: 1rem !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
          
          .nav-component .nav-component__content {
            max-width: 1200px !important;
            margin: 0 auto !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
          }
          
          .nav-component .nav-component__logo {
            font-size: 1.5rem !important;
            font-weight: bold !important;
            color: #000 !important;
            text-decoration: none !important;
          }
          
          .nav-component .nav-component__links {
            display: flex !important;
            gap: 1.5rem !important;
            align-items: center !important;
          }
          
          .nav-component .nav-component__link {
            color: #4b5563 !important;
            text-decoration: none !important;
            font-weight: 500 !important;
            padding: 0.5rem !important;
          }
          
          .nav-component .nav-component__button {
            background: #000 !important;
            color: white !important;
            padding: 0.5rem 1rem !important;
            border-radius: 0.375rem !important;
            border: none !important;
            cursor: pointer !important;
            font-weight: 500 !important;
          }
          
          .nav-component .nav-component__button:hover {
            background: #1a1a1a !important;
          }
        `}
      </style>
      <nav className="nav-component">
        <div className="nav-component__container">
          <div className="nav-component__content">
            <Link to="/" className="nav-component__logo">
              BookRental
            </Link>
            <div className="nav-component__links">
              {auth?.user ? (
                <>
                  <Link to="/books" className="nav-component__link">Books</Link>
                  <Link to="/rental" className="nav-component__link">My Rentals</Link>
                  <button onClick={handleLogout} className="nav-component__button">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-component__link">Login</Link>
                  <Link to="/register" className="nav-component__link">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div style={{ marginTop: '4rem' }} />
    </>
  );
};
export default Navbar;
