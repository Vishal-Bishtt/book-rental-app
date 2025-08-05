const pool = require('../db/db');

const Book = {
    async findAll() {
        const result = await pool.query('SELECT * FROM books');
        return result.rows;
    },
    
    async findById(id) {
        const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
        return result.rows[0];
    },
    
    async update(id, data) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        
        if (data.title !== undefined) {
            fields.push(`title = $${paramCount++}`);
            values.push(data.title);
        }
        if (data.author !== undefined) {
            fields.push(`author = $${paramCount++}`);
            values.push(data.author);
        }
        if (data.genre !== undefined) {
            fields.push(`genre = $${paramCount++}`);
            values.push(data.genre);
        }
        if (data.is_available !== undefined) {
            fields.push(`is_available = $${paramCount++}`);
            values.push(data.is_available);
        }
        
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        
        values.push(id);
        const result = await pool.query(
            `UPDATE books SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
            values
        );
        return result.rows[0];
    },
    
    async delete(id) {
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },
    
    async create({title, author, genre}){
        const result = await pool.query(
            'INSERT INTO books (title, author, genre, is_available) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author, genre, true]
        );
        return result.rows[0];
    },
};
module.exports = Book;
