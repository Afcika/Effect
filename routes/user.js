// userRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../db/db');  // Import the centralized DB connection
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/userMiddleware');

// Route to get the logged-in user's profile
router.get('/users/profile', authenticateToken, (req, res) => {
    const userId = req.user.id; // Extract user ID from the JWT

    console.log('Fetching profile for user ID:', userId); // Log user ID

    db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        // Render the profile page and pass the user data to the view
        res.render('profile', {
            title: 'Profile Page',
            user: results[0]
        });
    });
});




router.post('/users/update-name', authenticateToken, (req, res) => {
    const userId = req.user.id;  // Extract user ID from the JWT
    const { newName, currentPassword } = req.body;

    if (!newName || !currentPassword) {
        return res.status(400).send('New name and current password are required');
    }

    // Retrieve the user's hashed password from the database
    db.query('SELECT password FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const hashedPassword = results[0].password;

        // Compare the provided current password with the hashed password
        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).send('Internal server error');
            }

            if (!isMatch) {
                return res.status(401).send('Current password is incorrect');
            }

            // Update the user's profile name
            db.query('UPDATE users SET name = ? WHERE id = ?', [newName, userId], (updateError, updateResults) => {
                if (updateError) {
                    console.error('Database update error:', updateError);
                    return res.status(500).send('Internal server error');
                }

                res.status(200).send('Profile name updated successfully');
            });
        });
    });
});


router.post('/api/update-password', authenticateToken, (req, res) => {
    const userId = req.user.id;  // Extract user ID from the JWT
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).send('Current password, new password, and confirm password are required');
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).send('New password and confirm password do not match');
    }

    // Retrieve the user's hashed password from the database
    db.query('SELECT password FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        const hashedPassword = results[0].password;

        // Compare the provided current password with the hashed password
        bcrypt.compare(currentPassword, hashedPassword, (err, isMatch) => {
            if (err) {
                console.error('Password comparison error:', err);
                return res.status(500).send('Internal server error');
            }

            if (!isMatch) {
                return res.status(401).send('Current password is incorrect');
            }

            // Hash the new password
            bcrypt.hash(newPassword, 8, (hashErr, hashedNewPassword) => {
                if (hashErr) {
                    console.error('Password hashing error:', hashErr);
                    return res.status(500).send('Internal server error');
                }

                // Update the user's password in the database
                db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId], (updateError, updateResults) => {
                    if (updateError) {
                        console.error('Database update error:', updateError);
                        return res.status(500).send('Internal server error');
                    }

                    res.status(200).send('Password updated successfully');
                   
                });
            });
        });
    });
});

router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id; // Extract user ID from the JWT

    db.query('SELECT id, name, email, role_id,status FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).send('Internal server error');
        }

        if (results.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(results[0]); 
    });
});

router.post('/logout', (req, res) => {
    
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out. Please try again.');
        }
        res.clearCookie('jwt'); 
        res.status(200).send('Logged out successfully.');
    });

    
});
module.exports = router;
