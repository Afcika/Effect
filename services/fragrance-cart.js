// services/reservationService.js
const db = require('../db/db');

// Fetch reserved books for a user
const getReservedFragranceByUserId = (userId, callback) => {
    const query = `
    SELECT fragrances.*, cart.user_id, cart.quantity, fragrances.price
    FROM fragrances
    JOIN cart ON fragrances.id = cart.fragrance_id
    WHERE cart.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        // Calculate the total price in the application
        let totalPrice = 0;
        results.forEach(item => {
            totalPrice += parseFloat(item.price)*item.quantity;
        });
        totalPrice = totalPrice.toFixed(2);

        // Add total price to the results
        callback(null, { fragrances: results, total_price: totalPrice });
    });
};


// Fetch user reservation limit and count
const getUserReservationLimitAndCount = (userId, callback) => {
    const query = `
        SELECT reservation_limit, 
        (SELECT COUNT(*) FROM cart WHERE user_id = ?) AS reservation_count 
        FROM users WHERE id = ?
    `;
    db.query(query, [userId, userId], callback);
};

// Check if user has already reserved a book
const checkExistingFragrance = (userId, fragranceId, callback) => {
    db.query('SELECT * FROM cart WHERE user_id = ? AND fragrance_id = ?', [userId, fragranceId], callback);
};

// Create a new reservation
const addToCart = (userId, fargranceId, callback) => {
    db.query('INSERT INTO cart (user_id, fragrance_id) VALUES (?, ?)', [userId, fargranceId], callback);
};

// Delete a reservation
const deleteFromCart = (userId, fargranceId, callback) => {
    db.query('DELETE FROM cart WHERE user_id = ? AND fragrance_id = ?', [userId, fargranceId], callback);
};


const updateQuantityInCart = (userId, fragranceId, quantity, callback) => {
    db.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND fragrance_id = ?', [quantity, userId, fragranceId], callback);
};

module.exports = {
    getReservedFragranceByUserId,
    getUserReservationLimitAndCount,
    checkExistingFragrance,
    addToCart,
    deleteFromCart,
    updateQuantityInCart
};
