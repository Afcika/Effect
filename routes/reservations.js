const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const authenticateToken = require('../middleware/userMiddleware');

// Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Route to get reservations for the logged-in user


module.exports = router;
