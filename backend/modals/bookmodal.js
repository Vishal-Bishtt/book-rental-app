const prisma = require('../prisma/client');

const Book = {
    async findAll() {
        return await prisma.book.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });
    },
    
    async findById(id) {
        return await prisma.book.findUnique({
            where: { id: parseInt(id) }
        });
    },
    
    async update(id, data) {
        // Filter out undefined values
        const updateData = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.author !== undefined) updateData.author = data.author;
        if (data.genre !== undefined) updateData.genre = data.genre;
        if (data.is_available !== undefined) updateData.is_available = data.is_available;
        
        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update');
        }
        
        return await prisma.book.update({
            where: { id: parseInt(id) },
            data: updateData
        });
    },
    
    async delete(id) {
        return await prisma.book.delete({
            where: { id: parseInt(id) }
        });
    },
    
    async create({title, author, genre}){
        return await prisma.book.create({
            data: {
                title,
                author,
                genre,
                is_available: true
            }
        });
    },
};
module.exports = Book;
