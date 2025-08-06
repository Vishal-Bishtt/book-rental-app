const prisma = require('../prisma/client');

const User = {
    async findAll() {
        return await prisma.user.findMany({
            orderBy: {
                created_at: 'desc'
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
                // Exclude password from results
            }
        });
    },
    
    async findById(id) {
        return await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
                // Exclude password from results
            }
        });
    },
    
    async update(id, data) {
        const updateData = {};
        if (data.username !== undefined) updateData.username = data.username;
        if (data.email !== undefined) updateData.email = data.email;
        if (data.password !== undefined) updateData.password = data.password;
        if (data.role !== undefined) updateData.role = data.role;
        
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
                // Exclude password from results
            }
        });
    },
    
    async delete(id) {
        return await prisma.user.delete({
            where: { id: parseInt(id) },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
                // Exclude password from results
            }
        });
    },
    
    async create({username, email, password, role='user'}){
        return await prisma.user.create({
            data: {
                username,
                email,
                password,
                role
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true
                // Exclude password from results
            }
        });
    },
};
module.exports = User;