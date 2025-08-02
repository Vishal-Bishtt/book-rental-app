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
        const result = await pool.query(
            'UPDATE books SET title = $1, author = $2, genre = $3 WHERE id = $4 RETURNING *',
            [data.title, data.author, data.genre, id]
        );
        return result.rows[0];
    },
    
    async delete(id) {
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    },
    
    async create({title, author, genre = true}){
        const result = await pool.querry(
            'INSERT INTO books (title,author,genre) VALUES ($1,$2,$3)',[title,author,genre]
        );
        return result.rows[0];
    },
};
module.exports = Book;
