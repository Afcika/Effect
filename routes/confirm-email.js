const express = require("express");
const authController = require("../controllers/auth")
const router = express.Router();



// In your routes/auth.js or a dedicated routes file for email confirmation

// In your routes/auth.js or a dedicated routes file for email confirmation

router.post('/confirm-email', authController.confirmEmail);


module.exports = router;