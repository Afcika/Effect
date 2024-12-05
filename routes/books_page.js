const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { isAuthenticated } = require('../middleware/authMiddleware');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
// Route for the profile page
router.get('/', (req, res) => {
    // Assuming you're using Handlebars as the view engine
    res.render('books_page', {
        title: 'books Page',  
        userName: req.user ? req.user.name : 'Guest' // Example user data
    });
});




module.exports = router;
