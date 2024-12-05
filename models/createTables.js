const db = require('../db/db');

// Create Categories Table
const createCategoryTable = `
CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
`;

// Create Books Table
const createBooksTable = `
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    status VARCHAR(255),
    image VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES category(id)
);
`;

// Create Roles Table
const createRolesTable = `
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);
`;

// Create Users Table
const createUsersTable = `
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id INT(11) DEFAULT NULL,
    status VARCHAR(255) DEFAULT 'pending',
    verification_code VARCHAR(255) DEFAULT NULL,
    reservation_limit INT(11) DEFAULT 7
);
`;

// Create Reservations Table
const createReservationsTable = `
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
`;

// Create Fragrances Table
const createFragrancesTable = `
CREATE TABLE IF NOT EXISTS fragrances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    brand VARCHAR(255),
    image VARCHAR(255),
    gender VARCHAR(1),
    price DECIMAL(10, 2)
);
`;

// Create Carts Table
const createCartsTable = `
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fragrance_id INT NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (fragrance_id) REFERENCES fragrances(id)
);
`;

// Execute queries
db.query(createCategoryTable, (err, result) => {
    if (err) {
        console.error('Error creating category table:', err.stack);
    } else {
        console.log('Category table created or already exists');
    }
});

db.query(createBooksTable, (err, result) => {
    if (err) {
        console.error('Error creating books table:', err.stack);
    } else {
        console.log('Books table created or already exists');
    }
});

db.query(createRolesTable, (err, result) => {
    if (err) {
        console.error('Error creating roles table:', err.stack);
    } else {
        console.log('Roles table created or already exists');
    }
});

db.query(createUsersTable, (err, result) => {
    if (err) {
        console.error('Error creating users table:', err.stack);
    } else {
        console.log('Users table created or already exists');
    }
});

db.query(createReservationsTable, (err, result) => {
    if (err) {
        console.error('Error creating reservations table:', err.stack);
    } else {
        console.log('Reservations table created or already exists');
    }
});

db.query(createFragrancesTable, (err, result) => {
    if (err) {
        console.error('Error creating fragrances table:', err.stack);
    } else {
        console.log('Fragrances table created or already exists');
    }
});

db.query(createCartsTable, (err, result) => {
    if (err) {
        console.error('Error creating cart table:', err.stack);
    } else {
        console.log('Cart table created or already exists');
    }
});

db.end();
