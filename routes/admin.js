const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');


// Routes for users
router.get('/users', UserController.getAllUsers);
router.post('/users/create', UserController.createUser);
router.post('/users/edit', UserController.updateUser);
router.post('/users/delete', UserController.deleteUser);
router.get('/users/search', UserController.searchUsers);

module.exports = router;
