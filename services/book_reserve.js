// services/reservationService.js
const db = require('../db/db');

// Fetch reserved books for a user
const getReservedBooksByUserId = (userId, callback) => {
    const query = `
        SELECT books.*, reservations.user_id
        FROM books
        JOIN reservations ON books.id = reservations.book_id
        WHERE reservations.user_id = ?
    `;
    db.query(query, [userId], callback);
};

// Fetch user reservation limit and count
const getUserReservationLimitAndCount = (userId, callback) => {
    const query = `
        SELECT reservation_limit, 
        (SELECT COUNT(*) FROM reservations WHERE user_id = ?) AS reservation_count 
        FROM users WHERE id = ?
    `;
    db.query(query, [userId, userId], callback);
};

// Check if user has already reserved a book
const checkExistingReservation = (userId, bookId, callback) => {
    db.query('SELECT * FROM reservations WHERE user_id = ? AND book_id = ?', [userId, bookId], callback);
};

// Create a new reservation
const createReservation = (userId, bookId, callback) => {
    db.query('INSERT INTO reservations (user_id, book_id) VALUES (?, ?)', [userId, bookId], callback);
};

// Delete a reservation
const deleteReservation = (userId, bookId, callback) => {
    db.query('DELETE FROM reservations WHERE user_id = ? AND book_id = ?', [userId, bookId], callback);
};

module.exports = {
    getReservedBooksByUserId,
    getUserReservationLimitAndCount,
    checkExistingReservation,
    createReservation,
    deleteReservation
};
