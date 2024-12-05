// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bookController = require('../controllers/bookController');

//Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, 'public/files');
        } else if (file.mimetype.startsWith('image/')) {
            cb(null, 'public/images');
        } else {
            cb(new Error('Invalid file type'));
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route to render the book management page
router.get('/', (req, res) => {
    res.render('book');  // Render the Handlebars view for book management
});

// Fetch all books
router.get('/all', bookController.getAllBooks);

// Create a new book with image and PDF upload
router.post('/create', upload.fields([{ name: 'image' }, { name: 'pdf' }]), bookController.createBook);

// Edit a book
router.post('/edit', bookController.editBook);

// Delete a book
//router.post('/delete', bookController.deleteBook);

// Fetch all categories
router.get('/categories', bookController.getAllCategories);










module.exports = router;
