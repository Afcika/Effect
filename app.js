const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const cors = require('cors'); 
const hbs = require('hbs');
const Swal = require('sweetalert2')
const admin = require('./routes/admin');
const booksRouter = require('./routes/book_reserve'); 
const session = require('express-session');

dotenv.config({ path: './.env' });

const app = express();

// Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

// Set up public directory
const publicDirectory = path.join(__dirname, 'public');
app.use(express.static(publicDirectory));

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: '123', // Use a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Register user data in locals

// Define paths for Express
const viewsPath = path.join(__dirname, 'views');
const partialsPath = path.join(__dirname, 'views', 'partials');
app.use('/pdf_files', express.static(path.join(__dirname, 'public/files')));

// Set view engine to hbs (Handlebars)
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Register partials
hbs.registerPartials(partialsPath);








// Connect to the database
db.connect((error) => {
    if (error) {
        console.error('Database connection failed:', error.stack);
        return;
    }
    console.log('Connected to the database.');
});



// CORS setup (allows requests from other origins)
app.use(cors({
    origin: 'http://localhost:5000', // Adjust this if needed for frontend access
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow more HTTP methods if needed
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header if using JWTs
    credentials: true // Allow cookies or other credentials to be sent with the requests
}));




// Routes

app.use('/', require('./routes/pages'));
app.use('/', require('./routes/auth'));
app.use('/login', require('./routes/login'));
app.use('/admin', admin);
app.use('/books', require('./routes/book'));
app.use('/category', require('./routes/category'));
app.use('/home', require('./routes/home'));
app.use('/user', require('./routes/user'));
app.use('/api/users', require('./routes/user'));
app.use('/reservations', require('./routes/reservations'));
app.use('/confirm-email', require('./routes/confirm-email'));
app.use('/resend-code', require('./routes/auth'));
app.use('/request-email-change', require('./routes/email'));
app.use('/update-email', require('./routes/email'));
app.use('/profile', require('./routes/profile'));
app.use('/books', require('./routes/book_details'));
app.use('/books_page', require('./routes/books_page'));
app.use('/search_page', require('./routes/search_page'));
app.use('/search', require('./routes/search_page'));
app.use('/book', booksRouter);



app.use('/fragrances', require('./routes/fragrance'));
app.use('/cart', require('./routes/fragrance-cart'));
app.use('/catalog', require('./routes/catalog'));
app.use('/contactus', require('./routes/contactus'));
app.use('/cart', require('./routes/cart'));





// Start the server on port 5000 and listen on all network interfaces
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
});
