import React, { useEffect, useState } from "react";
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AdminBooks = () => {
  const { auth } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    is_available: true
  });

  // Fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      if (!auth?.token) return;
      
      try {
        const response = await axios.get('/admin/books', {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        setBooks(response.data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.response?.data?.message || 'Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [auth?.token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add new book
  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        '/admin/books',
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      setBooks(prev => [response.data, ...prev]);
      setFormData({ title: '', author: '', genre: '', is_available: true });
      setShowAddForm(false);
      alert('Book added successfully!');
    } catch (err) {
      console.error("Error adding book:", err);
      alert(err.response?.data?.message || 'Failed to add book');
    }
  };

  // Start editing a book
  const handleEdit = (book) => {
    setEditingBook(book.id);
    setFormData({
      title: book.title,
      author: book.author || '',
      genre: book.genre || '',
      is_available: book.is_available
    });
  };

  // Update book
  const handleUpdateBook = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `/admin/books/${editingBook}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        }
      );
      setBooks(prev => prev.map(book => 
        book.id === editingBook ? response.data : book
      ));
      setEditingBook(null);
      setFormData({ title: '', author: '', genre: '', is_available: true });
      alert('Book updated successfully!');
    } catch (err) {
      console.error("Error updating book:", err);
      alert(err.response?.data?.message || 'Failed to update book');
    }
  };

  // Delete book
  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await axios.delete(`/admin/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setBooks(prev => prev.filter(book => book.id !== bookId));
      alert('Book deleted successfully!');
    } catch (err) {
      console.error("Error deleting book:", err);
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBook(null);
    setFormData({ title: '', author: '', genre: '', is_available: true });
  };

  if (loading) {
    return <div className="loading">Loading books...</div>;
  }

  return (
    <div className="admin-books">
      <style jsx>{`
        .admin-books {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          background: #f8f9fa;
          min-height: 100vh;
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
        }

        .add-book-btn {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 12px 25px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .add-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
        }

        .form-container {
          background: white;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .form-title {
          font-size: 1.5rem;
          color: #2c3e50;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .book-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          align-items: end;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          margin-bottom: 8px;
          color: #495057;
        }

        .form-input {
          padding: 12px 15px;
          border: 2px solid #e9ecef;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }

        .form-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #007bff, #0056b3);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 123, 255, 0.4);
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .books-table-container {
          background: white;
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          overflow-x: auto;
        }

        .books-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .books-table th,
        .books-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .books-table th {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-size: 0.9rem;
        }

        .books-table tr:nth-child(even) {
          background: #f8f9fa;
        }

        .books-table tr:hover {
          background: #e3f2fd;
          transition: background-color 0.3s ease;
        }

        .availability-badge {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .available {
          background: #d4edda;
          color: #155724;
        }

        .unavailable {
          background: #f8d7da;
          color: #721c24;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-edit {
          background: #ffc107;
          color: #212529;
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .btn-edit:hover {
          background: #e0a800;
        }

        .btn-delete {
          background: #dc3545;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .btn-delete:hover {
          background: #c82333;
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

        .no-books {
          text-align: center;
          padding: 40px;
          color: #6c757d;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .admin-books {
            padding: 15px;
          }
          
          .page-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }
          
          .book-form {
            grid-template-columns: 1fr;
          }
          
          .books-table {
            font-size: 0.9rem;
          }
          
          .books-table th,
          .books-table td {
            padding: 10px 8px;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">📚 Manage Books</h1>
        <button 
          className="add-book-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✖ Cancel' : '+ Add New Book'}
        </button>
      </div>

      {error && <div className="error">Error: {error}</div>}

      {(showAddForm || editingBook) && (
        <div className="form-container">
          <h3 className="form-title">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h3>
          <form onSubmit={editingBook ? handleUpdateBook : handleAddBook}>
            <div className="book-form">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Genre</label>
                <input
                  type="text"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="is_available"
                name="is_available"
                checked={formData.is_available}
                onChange={handleInputChange}
              />
              <label htmlFor="is_available" className="form-label">Available for rental</label>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={editingBook ? handleCancelEdit : () => setShowAddForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="books-table-container">
        <h3 className="form-title">All Books ({books.length})</h3>
        {books.length === 0 ? (
          <div className="no-books">No books found. Add your first book!</div>
        ) : (
          <table className="books-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author || 'N/A'}</td>
                  <td>{book.genre || 'N/A'}</td>
                  <td>
                    <span className={`availability-badge ${book.is_available ? 'available' : 'unavailable'}`}>
                      {book.is_available ? 'Available' : 'Rented'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(book)}
                        disabled={editingBook === book.id}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBooks;
