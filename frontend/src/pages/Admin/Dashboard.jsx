import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { auth } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalBooks: 0,
      activeRentals: 0,
      totalRentals: 0
    },
    rentals: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!auth?.token) return;
      
      try {
        const response = await axios.get('/admin/dashboard/stats', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth?.token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not Returned';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <style jsx>{`
        .admin-dashboard {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .dashboard-title {
          font-size: 2.5rem;
          margin: 0;
          font-weight: 700;
        }

        .dashboard-subtitle {
          font-size: 1.1rem;
          margin: 10px 0 0 0;
          opacity: 0.9;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-left: 5px solid #667eea;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .stat-card.books {
          border-left-color: #f093fb;
        }

        .stat-card.rentals {
          border-left-color: #4facfe;
        }

        .stat-card.active {
          border-left-color: #43e97b;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          display: block;
        }

        .stat-label {
          font-size: 1.1rem;
          color: #7f8c8d;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .rentals-section {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .section-title {
          font-size: 1.8rem;
          color: #2c3e50;
          margin-bottom: 25px;
          font-weight: 600;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }

        .rentals-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .rentals-table th,
        .rentals-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .rentals-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
        }

        .rentals-table tr:nth-child(even) {
          background: #f8f9fa;
        }

        .rentals-table tr:hover {
          background: #e3f2fd;
          transition: background-color 0.3s ease;
        }

        .status-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-active {
          background: #d4edda;
          color: #155724;
        }

        .status-returned {
          background: #cce7ff;
          color: #004085;
        }

        .no-rentals {
          text-align: center;
          padding: 40px;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .loading, .error {
          text-align: center;
          padding: 50px;
          font-size: 1.2rem;
        }

        .loading {
          color: #007bff;
        }

        .error {
          color: #dc3545;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 10px;
          margin: 20px;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 15px;
          }
          
          .dashboard-title {
            font-size: 2rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .rentals-table {
            font-size: 0.9rem;
          }
          
          .rentals-table th,
          .rentals-table td {
            padding: 10px 8px;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">📊 Admin Dashboard</h1>
        <p className="dashboard-subtitle">Book Rental Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{dashboardData.stats.totalUsers}</span>
          <span className="stat-label">Total Users</span>
        </div>
        <div className="stat-card books">
          <span className="stat-number">{dashboardData.stats.totalBooks}</span>
          <span className="stat-label">Total Books</span>
        </div>
        <div className="stat-card active">
          <span className="stat-number">{dashboardData.stats.activeRentals}</span>
          <span className="stat-label">Active Rentals</span>
        </div>
        <div className="stat-card rentals">
          <span className="stat-number">{dashboardData.stats.totalRentals}</span>
          <span className="stat-label">Total Rentals</span>
        </div>
      </div>

      <div className="rentals-section">
        <h2 className="section-title">📚 Rental History</h2>
        {dashboardData.rentals.length === 0 ? (
          <div className="no-rentals">No rental records found</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="rentals-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>User Email</th>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>Rented At</th>
                  <th>Returned At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.rentals.map((rental) => (
                  <tr key={rental.id}>
                    <td>{rental.user_name}</td>
                    <td>{rental.user_email}</td>
                    <td>{rental.book_title}</td>
                    <td>{rental.book_author}</td>
                    <td>{rental.book_genre}</td>
                    <td>{formatDate(rental.rented_at)}</td>
                    <td>{formatDate(rental.returned_at)}</td>
                    <td>
                      <span className={`status-badge ${rental.status === 'active' ? 'status-active' : 'status-returned'}`}>
                        {rental.status}
                      </span>
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

export default AdminDashboard;
