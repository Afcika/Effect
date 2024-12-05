const jwt = require('jsonwebtoken');

// Middleware to authenticate and extract user info
function authenticateToken(req, res, next) {
    // First check Authorization header for the token
    let token = req.cookies.jwt || req.headers['authorization']?.split(' ')[1];

    // If no token in header, check the cookies for 'token'
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).send('Access Denied. No Token Provided.');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token');
        }

        req.user = user;  // Store the user data in the request
        next();  // Proceed to the next middleware or route
    });
}

module.exports = authenticateToken;
