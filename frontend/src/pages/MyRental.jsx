import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const MyRentals = () => {
  const { auth } = useAuth();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState(null);

  const fetchRentals = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/rentals/my", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRentals(res.data);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
      alert("Failed to fetch your rentals");
    } finally {
      setLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.token) {
      fetchRentals();
    }
  }, [auth.token, fetchRentals]);

  const handleReturn = async (rentalId) => {
    if (returning) return;
    
    setReturning(rentalId);
    try {
      await axios.put(
        `http://localhost:5000/api/rentals/${rentalId}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      alert("Book returned successfully!");
      
      // Remove the returned rental from the list
      setRentals(prevRentals => prevRentals.filter(rental => rental.id !== rentalId));
    } catch (error) {
      console.error("Failed to return book", error);
      alert(error.response?.data?.message || "Error returning book");
    } finally {
      setReturning(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRented = (rentedAt) => {
    const rentDate = new Date(rentedAt);
    const now = new Date();
    const diffTime = Math.abs(now - rentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return <div className="loading">Loading your rentals...</div>;
  }

  return (
    <div className="my-rentals-container">
      <style jsx>{`
        .my-rentals-container {
          padding: 20px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .rentals-title {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 30px;
          font-size: 2.5rem;
          font-weight: 600;
        }

        .rentals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          padding: 0;
          list-style: none;
        }

        .rental-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e1e8ed;
          border-left: 5px solid #3498db;
          position: relative;
        }

        .rental-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .book-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .book-author {
          font-size: 1rem;
          color: #7f8c8d;
          margin-bottom: 8px;
        }

        .book-genre {
          font-size: 0.9rem;
          color: #8e44ad;
          font-weight: 500;
          margin-bottom: 15px;
          text-transform: capitalize;
        }

        .rental-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .rental-date {
          font-size: 0.9rem;
          color: #495057;
          margin-bottom: 5px;
        }

        .rental-duration {
          font-size: 0.85rem;
          color: #6c757d;
          font-style: italic;
        }

        .return-button {
          width: 100%;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #e74c3c, #c0392b);
          color: white;
        }

        .return-button:hover {
          background: linear-gradient(135deg, #c0392b, #a93226);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }

        .return-button:active {
          transform: translateY(0);
        }

        .return-button.returning {
          background: #f39c12;
          cursor: not-allowed;
        }

        .no-rentals {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 2px dashed #dee2e6;
        }

        .no-rentals-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .no-rentals-text {
          color: #6c757d;
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .no-rentals-subtext {
          color: #adb5bd;
          font-size: 1rem;
        }

        .loading {
          text-align: center;
          padding: 50px;
          font-size: 1.2rem;
          color: #7f8c8d;
        }

        .status-badge {
          display: inline-block;
          background: #28a745;
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 15px;
        }

        @media (max-width: 768px) {
          .rentals-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .my-rentals-container {
            padding: 15px;
          }
          
          .rentals-title {
            font-size: 2rem;
          }
          
          .rental-card {
            padding: 20px;
          }
        }
      `}</style>

      <h1 className="rentals-title">📦 My Rented Books</h1>
      
      {rentals.length === 0 ? (
        <div className="no-rentals">
          <div className="no-rentals-icon">📚</div>
          <div className="no-rentals-text">No books rented currently</div>
          <div className="no-rentals-subtext">
            Browse our collection and rent your favorite books!
          </div>
        </div>
      ) : (
        <ul className="rentals-grid">
          {rentals.map((rental) => (
            <li key={rental.id} className="rental-card">
              <span className="status-badge">Active Rental</span>
              
              <h3 className="book-title">{rental.title}</h3>
              {rental.author && <p className="book-author">by {rental.author}</p>}
              <p className="book-genre">{rental.genre}</p>
              
              <div className="rental-info">
                <div className="rental-date">
                  <strong>Rented on:</strong> {formatDate(rental.rented_at)}
                </div>
                <div className="rental-duration">
                  {getDaysRented(rental.rented_at)} day(s) ago
                </div>
              </div>
              
              <button
                className={`return-button ${returning === rental.id ? 'returning' : ''}`}
                onClick={() => handleReturn(rental.id)}
                disabled={returning === rental.id}
              >
                {returning === rental.id ? 'Returning...' : 'Return Book'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyRentals;
