const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Render category management page
router.get('/', categoryController.renderCategoryPage);

// Fetch all categories (API)
router.get('/all', categoryController.fetchAllCategories);

// Create a new category
router.post('/create', categoryController.createCategory);

// Fetch books by category ID and render the category_books view
router.get('/:categoryId/books', categoryController.fetchBooksByCategory);

// Edit category
router.post('/edit', categoryController.editCategory);

// Delete category
router.post('/delete', categoryController.deleteCategory);

module.exports = router;
