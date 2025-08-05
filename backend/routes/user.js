const express = require('express');
const{
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/usercontroller');

const authenticateToken = require('./auth/auth.middleware'); // protect routes if needed
const authorizationAdmin =require('./auth/authorizeAdmin');
const router = express.Router();

router.get('/',authenticateToken, authorizationAdmin, getAllUsers);
router.get('/:id',authenticateToken, getUserById);
router.post('/register', createUser); 
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken,authorizationAdmin, deleteUser);

module.exports = router;