// services/bookService.js
const db = require('../db/db');

// Fetch all books with their category names
const getAllBooks = (callback) => {
    const query = `
        SELECT books.*, category.name AS category_name
        FROM books
        JOIN category ON books.category_id = category.id
    `;
    db.query(query, callback);
};

// Create a new book
const createBook = (bookData, callback) => {
    const { name, description, status, author, category_id, imageUrl, pdfUrl } = bookData;
    const query = `INSERT INTO books (name, description, status, author, category_id, image) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, description, status, author, category_id, imageUrl, pdfUrl];
    db.query(query, values, callback);
};

// Edit an existing book
const editBook = (bookData, callback) => {
    const { id, name, description, status, image, author, category_id } = bookData;
    const query = `UPDATE books SET name = ?, description = ?, status = ?, image = ?, author = ?, category_id = ? WHERE id = ?`;
    const values = [name, description, status, image, author, category_id, id];
    db.query(query, values, callback);
};

// Delete a book
const deleteBook = (id, callback) => {
    const query = `DELETE FROM books WHERE id = ?`;
    db.query(query, [id], callback);
};

// Fetch all categories
const getAllCategories = (callback) => {
    const query = `SELECT * FROM category`;
    db.query(query, callback);
};






module.exports = {
    getAllBooks,
    createBook,
    editBook,
    deleteBook,
    getAllCategories,
};
