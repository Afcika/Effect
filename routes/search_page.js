const express = require('express');
const router = express.Router();
const mysql = require('mysql2');



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
// Route for the profile page
router.get('/', (req, res) => {
    // Assuming you're using Handlebars as the view engine
    res.render('search_page', {
        title: 'search Page',  
        userName: req.user ? req.user.name : 'Guest' // Example user data
    });
});
router.get('/search', (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).send('Search query is required');
    }

    // Search for books with matching names or descriptions
    db.query(`
        SELECT books.*, category.name AS category_name
        FROM books
        JOIN category ON books.category_id = category.id
        WHERE books.name LIKE ? OR books.description LIKE ?
    `, [`%${query}%`, `%${query}%`], (error, results) => {
        if (error) {
            console.error('Error searching for books:', error);
            return res.status(500).send('Error searching for books');
        }
        res.json(results);  // Return search results as JSON
    });
});







module.exports = router;
