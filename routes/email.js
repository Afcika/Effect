const express = require('express');
const router = express.Router();

// Middleware and database connection
const { isAuthenticated } = require('../middleware/authMiddleware');
const db = require('../db/db');

// Update email route
router.post('/', isAuthenticated, (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user.id;

    if (!newEmail) {
        return res.status(400).json({ success: false, message: 'New email is required' });
    }

    db.query('UPDATE users SET email = ? WHERE id = ?', [newEmail, userId], (err, result) => {
        if (err) {
            console.error('Error updating email:', err);
            return res.status(500).json({ success: false, message: 'Error updating email' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: 'Email updated successfully' });
    });
});

module.exports = router;
