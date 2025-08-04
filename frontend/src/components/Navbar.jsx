import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/books" style={styles.link}>Books</Link>
        <Link to="/my-rentals" className="px-3 py-1 hover:underline">
        My Rentals
        </Link>
        {auth?.user?.role === "admin" && (
          <Link to="/dashboard/admin" style={styles.link}>Admin</Link>
        )}
        {auth?.user?.role === "user" && (
          <Link to="/dashboard/user" style={styles.link}>Dashboard</Link>
        )}
      </div>

      <div>
        {!auth?.token ? (
          <Link to="/login" style={styles.link}>Login</Link>
        ) : (
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: "10px 20px",
    backgroundColor: "#f0f0f0",
    display: "flex",
    justifyContent: "space-between"
  },
  link: {
    marginRight: "15px",
    textDecoration: "none",
    color: "#333"
  },
  button: {
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "blue",
    textDecoration: "underline"
  }
};

export default Navbar;
