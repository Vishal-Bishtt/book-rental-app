# 🔐 Admin Dashboard Testing Guide

## 🎯 Admin Login Credentials

**Email**: `admin@bookrental.com`  
**Password**: `supersecurepassword`

## 🧪 How to Test Admin Features

### 1. **Login as Admin**
- Go to `/login`
- Use the admin credentials above
- You should see admin links in the navbar after login

### 2. **Admin Dashboard** (`/admin/dashboard`)
- View total statistics:
  - Total Users
  - Total Books  
  - Active Rentals
  - Total Rentals
- See complete rental history table with:
  - User details
  - Book information
  - Rental dates
  - Return status

### 3. **Admin Books Management** (`/admin/books`)
- **View All Books**: See complete book inventory
- **Add New Book**: 
  - Click "Add New Book"
  - Fill in title, author, genre
  - Set availability status
- **Edit Book**:
  - Click "Edit" on any book
  - Modify details inline
- **Delete Book**:
  - Click "Delete" (with confirmation)
  - Cannot delete currently rented books

## 🔒 Security Features

- **Admin-only routes**: Regular users get redirected to login
- **JWT Authentication**: Admin status verified on every request
- **Backend Authorization**: All admin endpoints check role
- **Environment-based Auth**: Admin credentials in `.env` (secure)

## 🎨 UI Features

- **Professional Dashboard**: Statistics cards and data tables
- **Responsive Design**: Works on mobile and desktop
- **Real-time Data**: Live updates from database
- **Intuitive Management**: Easy CRUD operations for books
- **Status Indicators**: Visual badges for availability/rental status

## 🚀 Quick Test Workflow

1. **Login as admin** → Should see admin nav links
2. **Visit Dashboard** → Should see stats and rental table
3. **Add a book** → Should appear in inventory immediately  
4. **Edit/Delete** → Should work with confirmation
5. **Rent as regular user** → Should update admin dashboard

## 📊 Database Integration

- **Live Statistics**: Counts updated from PostgreSQL
- **Complete Rental History**: All transactions with user/book details
- **Foreign Key Relationships**: Proper data integrity
- **Transaction Safety**: Book availability managed correctly

Your admin system is now fully functional! 🎉
