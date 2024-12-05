// routes/books.js (or whatever your router file is named)
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');


// Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Reserve a book route
router.post('/reserve', (req, res) => {
    const { user_id, book_id } = req.body;

    // Check if the book is available
    db.query('SELECT status FROM books WHERE id = ?', [book_id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(500).json({ success: false, message: 'Error checking book availability or book not found.' });
        }

        const bookStatus = results[0].status.toLowerCase();
        if (bookStatus === 'available') {
            // Update book status to 'unavailable'
            db.query('UPDATE books SET status = ? WHERE id = ?', ['unavailable', book_id], (err) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error updating book status.' });
                }

                // Insert reservation record
                db.query('INSERT INTO reservations (user_id, book_id) VALUES (?, ?)', [user_id, book_id], (err) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: 'Error creating reservation.' });
                    }
                    return res.json({ success: true, message: 'Book reserved successfully.' });
                });
            });
        } else {
            return res.json({ success: false, message: 'Book is already unavailable.' });
        }
    });
});
// routes/home.js



module.exports = router;
