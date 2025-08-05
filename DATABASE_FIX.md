# 🔧 Database Setup Fix for "relation rentals does not exist"

## 🚨 The Problem
Your PostgreSQL database is missing the required tables: `users`, `books`, and `rentals`.

## ✅ Solution - Quick Fix

### Option 1: Automatic Setup (Recommended)
Run this in your backend directory:

```bash
cd backend
npm run db:init
```

### Option 2: Manual SQL Setup
Connect to your PostgreSQL database and run the SQL file:

```bash
# Using psql command line
psql -d your_database_name -f backend/database/quick-setup.sql

# Or copy the content from backend/database/quick-setup.sql and paste in your DB tool
```

### Option 3: Full Schema Setup (Advanced)
For production with all features:

```bash
psql -d your_database_name -f backend/database/schema.sql
```

## 🗃️ Database Schema Created

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Books Table
```sql
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    genre VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rentals Table ⭐ (This was missing!)
```sql
CREATE TABLE rentals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    book_id INTEGER NOT NULL REFERENCES books(id),
    rented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔗 Foreign Keys Added
- `rentals.user_id` → `users.id`
- `rentals.book_id` → `books.id`

## 🎯 Sample Data Included
- **Admin user**: admin@bookrental.com (password: admin123)
- **Test user**: john@example.com (password: user123)
- **5 sample books** ready for testing

## 🧪 Test Your Setup

1. **Check if tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'books', 'rentals');
```

2. **Test rental creation:**
```bash
cd backend
node test-db.js
```

3. **Start your backend:**
```bash
npm start
```

4. **Test from frontend:**
- Go to Books page
- Click "Rent Book" on any available book
- Should work without "relation does not exist" error!

## 🚀 Your Backend Route is Correct

Your rental route at `POST /api/rentals` is working correctly. The issue was just missing database tables.

## 🔄 Next Steps After Database Setup

1. **Test the rental flow:**
   - Login to your app
   - Go to Books page
   - Click "Rent Book"
   - Check "My Rentals" page

2. **Verify data integrity:**
   - Book should show as "Not Available" after renting
   - Rental should appear in "My Rentals"
   - Return should work and restore availability

## 🐛 If You Still Get Errors

1. **Check DATABASE_URL in .env:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
```

2. **Verify PostgreSQL is running:**
```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

3. **Check database connection:**
```bash
cd backend
node -e "const pool = require('./db/db'); pool.query('SELECT NOW()').then(r => console.log('Connected:', r.rows[0])).catch(console.error)"
```

## 📋 Summary

✅ **Fixed**: Missing `rentals` table
✅ **Added**: Proper foreign key relationships  
✅ **Included**: Sample data for testing
✅ **Enhanced**: Database indexes for performance
✅ **Ready**: Your rental system should now work perfectly!

Run `npm run db:init` and your rental functionality will work! 🎉
