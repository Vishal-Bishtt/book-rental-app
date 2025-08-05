import React, { useEffect, useState } from "react";
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { auth } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!auth?.token) return;
      
      try {
        const usersResponse = await axios.get('/admin/users', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setUsers(usersResponse.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [auth?.token]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        .admin-users-page {
          font-family: system-ui, -apple-system, sans-serif;
        }
        .admin-users-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .admin-users-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 10px 0;
        }
        .admin-users-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }
        .admin-users-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .admin-stat-card {
          background: white;
          padding: 25px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
          border: 1px solid #e9ecef;
        }
        .admin-stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #495057;
          margin: 0;
        }
        .admin-stat-label {
          font-size: 1rem;
          color: #6c757d;
          margin: 5px 0 0 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-users-table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          border: 1px solid #e9ecef;
        }
        .admin-users-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-users-table th,
        .admin-users-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        .admin-users-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .admin-users-table tr:hover {
          background-color: #f8f9fa;
        }
        .admin-role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .admin-role-admin {
          background: #dc3545;
          color: white;
        }
        .admin-role-user {
          background: #28a745;
          color: white;
        }
      `}</style>
      
      <div className="admin-users-page">
        {/* Header */}
        <div className="admin-users-header">
          <h1 className="admin-users-title">👥 User Management</h1>
          <p className="admin-users-subtitle">Manage all registered users and their activities</p>
        </div>

        {/* Statistics */}
        <div className="admin-users-stats">
          <div className="admin-stat-card">
            <h3 className="admin-stat-number">{users.length}</h3>
            <p className="admin-stat-label">Total Users</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-number">{users.filter(user => user.role === 'admin').length}</h3>
            <p className="admin-stat-label">Admins</p>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-number">{users.filter(user => user.role === 'user').length}</h3>
            <p className="admin-stat-label">Regular Users</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="admin-users-table-container">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`admin-role-badge ${user.role === 'admin' ? 'admin-role-admin' : 'admin-role-user'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
