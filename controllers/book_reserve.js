// controllers/reservationController.js
const reservationService = require('../services/book_reserve');

// Get reserved books by user ID
const getReservedBooks = (req, res) => {
    const userId = req.user.id;

    reservationService.getReservedBooksByUserId(userId, (err, results) => {
        if (err) {
            console.error('Error fetching reserved books:', err);
            return res.status(500).json({ message: 'Error fetching reserved books' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No reserved books found' });
        }

        return res.json(results);
    });
};

// Reserve a book
const reserveBook = (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    reservationService.getUserReservationLimitAndCount(userId, (err, result) => {
        if (err) {
            console.error('Error fetching user data:', err);
            return res.status(500).json({ success: false, message: 'Error fetching user data.' });
        }

        const user = result[0];
        const reservationLimit = user.reservation_limit;
        const reservationCount = user.reservation_count;

        // Check if the user has reached their reservation limit
        if (reservationCount >= reservationLimit) {
            return res.status(400).json({ success: false, message: `You cannot reserve more than ${reservationLimit} books.` });
        }

        // Check if the user has already reserved this book
        reservationService.checkExistingReservation(userId, bookId, (err, results) => {
            if (err) {
                console.error('Error checking existing reservations:', err);
                return res.status(500).json({ success: false, message: 'Error checking existing reservation.' });
            }

            if (results.length > 0) {
                return res.status(400).json({ success: false, message: 'You have already reserved this book.' });
            }

            // Create the reservation
            reservationService.createReservation(userId, bookId, (err) => {
                if (err) {
                    console.error('Error creating reservation:', err);
                    return res.status(500).json({ success: false, message: 'Error creating reservation.' });
                }
                return res.json({ success: true, message: 'Book reserved successfully!' });
            });
        });
    });
};

// Delete a reservation
const deleteReservation = (req, res) => {
    const userId = req.user.id;
    const bookId = req.params.bookId;

    reservationService.deleteReservation(userId, bookId, (err, result) => {
        if (err) {
            console.error('Error deleting reservation:', err);
            return res.status(500).json({ success: false, message: 'Error deleting reservation.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No reservation found to delete.' });
        }

        return res.json({ success: true, message: 'წარმატებით წაიშალა რეზერვაცია' });
    });
};

module.exports = {
    getReservedBooks,
    reserveBook,
    deleteReservation
};
