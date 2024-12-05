// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const reservationController = require('../controllers/book_reserve');

// Route to get all reserved books for the authenticated user
router.get('/mybook', isAuthenticated, reservationController.getReservedBooks);

// Route to reserve a book
router.post('/reserve/:bookId', isAuthenticated, reservationController.reserveBook);

// Route to delete a reservation
router.delete('/reserve/:bookId', isAuthenticated, reservationController.deleteReservation);

module.exports = router;
