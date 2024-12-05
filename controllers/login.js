// const mysql = require('mysql2');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // Database connection
// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
// });

// exports.login = (req, res) => {
//     const { email, password } = req.body;

//     // Check if both email and password are provided
//     if (!email || !password) {
//         return res.status(400).render('login', {
//             message: 'Please provide an email and password'
//         });
//     }

//     // Query the database for the user with the provided email
//     db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
//         if (error) {
//             console.error('Database query error:', error);
//             return res.status(500).render('login', {
//                 message: 'An error occurred. Please try again.'
//             });
//         }

//         // Check if no user was found
//         if (results.length === 0) {
//             return res.status(401).render('login', {
//                 message: 'Email or Password is incorrect'
//             });
//         }

//         const user = results[0];

//         // Check if the user has confirmed their email
//         if (user.status !== 'active') {
//             return res.status(403).render('login', {
//                 message: 'Please confirm your email before logging in.'
//             });
//         }

//         // Compare the provided password with the stored hashed password
//         const isPasswordMatch = await bcrypt.compare(password, user.password);

//         if (!isPasswordMatch) {
//             return res.status(401).render('login', {
//                 message: 'Email or Password is incorrect'
//             });
//         }

//         // Log the user role_id for verification (optional)
//         console.log('User role_id after login:', user.role_id);

//         // Sign the JWT token with user information
//         const token = jwt.sign({ id: user.id, name: user.name, role_id: user.role_id, email: user.email, status: user.status }, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN || '1h'
//         });
        
//         // Calculate the expiration time for the cookie
//         const expiresInMillis = process.env.JWT_COOKIE_EXPIRES ? process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

//         // Set the JWT token in the cookie
//         res.cookie('jwt', token, {
//             expires: new Date(Date.now() + expiresInMillis),
//             httpOnly: true
//         });

//         // Redirect user based on their role_id
//         if (user.role_id === 1) {
//             console.log('Redirecting to admin page');
//             return res.status(200).redirect('/admin');
//         } else {
//             console.log('Redirecting to user page');
//             return res.status(200).redirect('/home');
//         }
        
        
//     });
// };



// const mysql = require('mysql2');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// // Database connection
// const db = mysql.createConnection({
//     host: process.env.DATABASE_HOST,
//     user: process.env.DATABASE_USER,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE
// });

// exports.login = (req, res) => {
//     const { email, password } = req.body;

//     // Check if both email and password are provided
//     if (!email || !password) {
//         return res.status(400).render('login', {
//             message: 'Please provide an email and password'
//         });
//     }

//     // Query the database for the user with the provided email
//     db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
//         if (error) {
//             console.error('Database query error:', error);
//             return res.status(500).render('login', {
//                 message: 'An error occurred. Please try again.'
//             });
//         }

//         // Check if no user was found
//         if (results.length === 0) {
//             return res.status(401).render('login', {
//                 message: 'Email or Password is incorrect'
//             });
//         }

//         const user = results[0];

//         // Check if the user has confirmed their email
//         if (user.status !== 'active') {
//             return res.status(403).render('login', {
//                 message: 'Please confirm your email before logging in.'
//             });
//         }

//         // Compare the provided password with the stored hashed password
//         const isPasswordMatch = await bcrypt.compare(password, user.password);

//         if (!isPasswordMatch) {
//             return res.status(401).render('login', {
//                 message: 'Email or Password is incorrect'
//             });
//         }

//         // Log the user role_id for verification (optional)
//         console.log('User role_id after login:', user.role_id);

//         // Sign the JWT token with user information
//         const token = jwt.sign(
//             { id: user.id, name: user.name, role_id: user.role_id, email: user.email, status: user.status },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: process.env.JWT_EXPIRES_IN || '1h'
//             }
//         );
        
//         // Calculate the expiration time for the cookie
//         const expiresInMillis = process.env.JWT_COOKIE_EXPIRES
//             ? process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//             : 60 * 60 * 1000;

//         // Set the JWT token in the cookie
//         res.cookie('jwt', token, {
//             expires: new Date(Date.now() + expiresInMillis),
//             httpOnly: true // Keep this for security
//         });

//         // Always return the token in the JSON response (for testing)
//         return res.status(200).json({
//             message: 'Login successful',
//             token,  // Return token in the JSON response for both Postman and browser requests
//             role_id: user.role_id
//         });
//     });
// };



const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).render('login', {
            message: 'Please provide an email and password'
        });
    }

    // Query the database for the user with the provided email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).render('login', {
                message: 'An error occurred. Please try again.'
            });
        }

        // Check if no user was found
        if (results.length === 0) {
            return res.status(401).render('login', {
                message: 'Email or Password is incorrect'
            });
        }

        const user = results[0];

        // Check if the user has confirmed their email
        if (user.status !== 'active') {
            return res.status(403).render('login', {
                message: 'Please confirm your email before logging in.'
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).render('login', {
                message: 'Email or Password is incorrect'
            });
        }

        // Log the user role_id for verification (optional)
        console.log('User role_id after login:', user.role_id);

        // Sign the JWT token with user information
        const token = jwt.sign(
            { id: user.id, name: user.name, role_id: user.role_id, email: user.email, status: user.status },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1h'
            }
        );
        
        // Calculate the expiration time for the cookie
        const expiresInMillis = process.env.JWT_COOKIE_EXPIRES
            ? process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            : 60 * 60 * 1000;

        // Set the JWT token in the cookie
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + expiresInMillis),
            httpOnly: true // Keep this for security
        });

        // Redirect user based on their role_id
        if (user.role_id === 1) {
            console.log('Redirecting to admin page');
            return res.status(200).redirect('/admin');
        } else {
            console.log('Redirecting to user page');
            return res.status(200).redirect('/home');
        }
    });
};
