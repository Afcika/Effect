const categoryService = require('../services/categoryService');

const categoryController = {
    renderCategoryPage: (req, res) => {
        res.render('category');  // Render the Handlebars view for category management
    },

    fetchAllCategories: async (req, res) => {
        try {
            const categories = await categoryService.fetchAll();
            res.json(categories);  // Return JSON with all categories
        } catch (error) {
            res.status(500).send(error);
        }
    },

    createCategory: async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send('Category name is required');
        }

        try {
            const message = await categoryService.create(name);
            res.send(message);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    fetchBooksByCategory: async (req, res) => {
        const categoryId = req.params.categoryId;

        try {
            const books = await categoryService.fetchBooksByCategory(categoryId);
            const categoryNameResult = await categoryService.fetchCategoryName(categoryId);
            const categoryName = categoryNameResult.length > 0 ? categoryNameResult[0].name : 'Unknown Category';
            
            res.render('category_books', { books, categoryName });
        } catch (error) {
            res.status(500).send(error);
        }
    },

    editCategory: async (req, res) => {
        const { id, name } = req.body;

        if (!id || !name) {
            return res.status(400).send('All fields are required');
        }

        try {
            const message = await categoryService.update(id, name);
            res.send(message);
        } catch (error) {
            res.status(500).send(error);
        }
    },

    deleteCategory: async (req, res) => {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send('ID is required');
        }

        try {
            const message = await categoryService.delete(id);
            res.send(message);
        } catch (error) {
            res.status(500).send(error);
        }
    }
};

module.exports = categoryController;
