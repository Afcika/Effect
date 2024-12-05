const express = require("express");
const authController = require("../controllers/auth")
const router = express.Router();
const db = require('../db/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
router.post("/register",authController.register)


// In your routes/auth.js or a dedicated routes file for email confirmation

// In your routes/auth.js or a dedicated routes file for email confirmation

router.post('/confirm-email', authController.confirmEmail);
// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route for resending verification code
router.post('/resend-code', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Check if email exists
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Email not found.' });
        }

        // Generate a new verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Update the verification code in the database
        await db.promise().query('UPDATE users SET verification_code = ? WHERE email = ?', [verificationCode, email]);

        // Send the verification code via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'New Email Verification Code',
            html: `<p>Your new verification code is:</p><h3>${verificationCode}</h3>`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Verification code resent successfully.' });
    } catch (error) {
        console.error('Error resending verification code:', error);
        res.status(500).json({ message: 'An error occurred while resending the verification code. Please try again.' });
    }
});

router.post("/resend-code", authController.resendCode);

module.exports = router;