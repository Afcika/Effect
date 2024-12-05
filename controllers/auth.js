const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../db/db');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


exports.register = async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    try {
       
        const [results] = await db.promise().query('SELECT email FROM users WHERE email = ?', [email]);

        if (results.length > 0) {
            return res.status(400).render('register', { message: 'That email is already in use' });
        }

        if (password !== passwordConfirm) {
            return res.status(400).render('register', { message: 'Passwords do not match' });
        }

       
        const hashedPassword = await bcrypt.hash(password, 8);

      
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

       
        await db.promise().query('INSERT INTO users SET ?', {
            name,
            email,
            password: hashedPassword,
            role_id: 2,
            status: 'pending',
            verification_code: verificationCode
        });

        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification Code',
            html: `<p>Thank you for registering. Please verify your email by entering the following code:</p>
                   <h3>${verificationCode}</h3>`
        };

        await transporter.sendMail(mailOptions);

        
        return res.status(201).redirect(`/confirm-email?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).render('register', { message: 'An error occurred during registration. Please try again.' });
    }
};



exports.confirmEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        
        if (!email || !verificationCode) {
            return res.status(400).render('confirm-email', { message: 'Email and verification code are required.' });
        }

       
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ? AND verification_code = ?', [email, verificationCode]);

       
        if (results.length === 0) {
            return res.status(400).render('confirm-email', { message: 'Invalid or expired verification code.' });
        }

       
        await db.promise().query('UPDATE users SET status = ?, verification_code = ? WHERE email = ?', ['active', null, email]);

        return res.status(200).redirect('/home');
    } catch (error) {
        console.error('Error during email confirmation:', error);
        return res.status(500).render('confirm-email', { message: 'An error occurred during email confirmation. Please try again.' });
    }
};



exports.resendCode = async (req, res) => {
    const { email } = req.body;

    try {
       
        const [results] = await db.promise().query('SELECT * FROM users WHERE email = ? AND status = "pending"', [email]);

        if (results.length === 0) {
            return res.status(400).render('confirm-email', { message: 'Email not found or already confirmed.' });
        }

      
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        await db.promise().query('UPDATE users SET verification_code = ? WHERE email = ?', [verificationCode, email]);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'New Email Verification Code',
            html: `<p>Your new verification code is:</p>
                   <h3>${verificationCode}</h3>`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).render('confirm-email', { message: 'A new verification code has been sent to your email.', email });
    } catch (error) {
        console.error('Error during resend code:', error);
        return res.status(500).render('confirm-email', { message: 'An error occurred while resending the code. Please try again.' });
    }
};



