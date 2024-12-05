// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const bookController = require('../controllers/book_details');

// Route to fetch book details by ID
router.get('/:id', isAuthenticated, bookController.getBookDetails);

// Route to fetch PDF by book ID
router.get('/pdf/:id', bookController.getBookPdf);

module.exports = router;
