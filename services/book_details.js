// services/bookService.js
const db = require('../db/db'); // Assuming db connection is exported from a config file

// Fetch book details with reservation status
const getBookById = (bookId, userId, callback) => {
    db.query(`
        SELECT books.*, category.name AS category_name,
            EXISTS (SELECT 1 FROM reservations WHERE user_id = ? AND book_id = ?) AS is_reserved
        FROM books
        JOIN category ON books.category_id = category.id
        WHERE books.id = ?
    `, [userId, bookId, bookId], callback);
};

// Fetch PDF path by book ID
const getBookPdfById = (bookId, callback) => {
    db.query('SELECT pdf_url FROM books WHERE id = ?', [bookId], callback);
};

module.exports = {
    getBookById,
    getBookPdfById
};
