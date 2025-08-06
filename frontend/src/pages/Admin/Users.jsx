import React, { useEffect, useState } from "react";
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users and their rental history
  useEffect(() => {
    const fetchUsersAndRentals = async () => {
      if (!auth?.token) return;
      
      try {
        // Fetch users
        const usersResponse = await axios.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setUsers(usersResponse.data);

        // Fetch rentals with user and book details
        const rentalsResponse = await axios.get('/admin/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setUserRentals(rentalsResponse.data.rentals || []);
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRentals();
  }, [auth?.token]);

  // Get rental count for a user
  const getUserRentalCount = (userId) => {
    return userRentals.filter(rental => rental.user_id === userId).length;
  };

  // Get active rentals for a user
  const getUserActiveRentals = (userId) => {
    return userRentals.filter(rental => rental.user_id === userId && rental.status === 'active').length;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        fontSize: '1.2rem',
        color: '#6c757d'
      }}>
        Loading users...
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <style>{`
        .admin-users {
          font-family: system-ui, -apple-system, sans-serif;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .page-title {
          font-size: 2.2rem;
          color: #2c3e50;
          margin: 0;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stats-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #667eea;
          margin: 0;
        }

        .stat-label {
          color: #6c757d;
          font-size: 0.9rem;
          margin-top: 5px;
        }

        .users-container {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .section-title {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .users-table th,
        .users-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .users-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table tr:hover {
          background-color: #f8f9fa;
          transition: background-color 0.3s ease;
        }

        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .role-admin {
          background: #dc3545;
          color: white;
        }

        .role-user {
          background: #28a745;
          color: white;
        }

        .rental-stats {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .rental-count {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .active-rentals {
          background: #fff3e0;
          color: #f57c00;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .no-data {
          text-align: center;
          color: #6c757d;
          font-style: italic;
          padding: 40px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #f5c6cb;
        }
      `}</style>

      <div className="admin-users">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">👥 Manage Users</h1>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* User Statistics */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'admin').length}</div>
            <div className="stat-label">Admin Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{users.filter(u => u.role === 'user').length}</div>
            <div className="stat-label">Regular Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{userRentals.filter(r => r.status === 'active').length}</div>
            <div className="stat-label">Active Rentals</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-container">
          <h2 className="section-title">All Users</h2>
          
          {users.length === 0 ? (
            <div className="no-data">
              No users found in the system.
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Rental Statistics</th>
                  <th>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <div className="rental-stats">
                        <span className="rental-count">
                          {getUserRentalCount(user.id)} Total
                        </span>
                        <span className="active-rentals">
                          {getUserActiveRentals(user.id)} Active
                        </span>
                      </div>
                    </td>
                    <td>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Rentals Section */}
        {userRentals.length > 0 && (
          <div className="users-container" style={{ marginTop: '30px' }}>
            <h2 className="section-title">Recent Rental Activity</h2>
            <table className="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Rented Date</th>
                  <th>Status</th>
                  <th>Returned Date</th>
                </tr>
              </thead>
              <tbody>
                {userRentals.slice(0, 10).map((rental) => (
                  <tr key={rental.id}>
                    <td>{rental.user_name}</td>
                    <td>{rental.book_title}</td>
                    <td>{rental.book_author}</td>
                    <td>{new Date(rental.rented_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`role-badge ${rental.status === 'active' ? 'role-admin' : 'role-user'}`}>
                        {rental.status}
                      </span>
                    </td>
                    <td>
                      {rental.returned_at ? new Date(rental.returned_at).toLocaleDateString() : 'Not returned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
