// db.js
const mysql = require('mysql2');
require('dotenv').config();
const url = require('url');

// Parse the connection string if provided
const connectionString = process.env.MYSQL_URL || process.env.DATABASE_URL;

let db;

if (connectionString) {
    // Parse connection URL for individual components
    const params = new url.URL(connectionString);

    db = mysql.createConnection({
        host: params.hostname,
        user: params.username,
        password: params.password,
        database: params.pathname.split("/")[1],
        port: params.port
    });
} else {
    // Fallback to individual environment variables
    db = mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PASSWORD || '11111',
        database: process.env.DATABASE || 'danelasql'
    });
}

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); 
    } else {
        console.log('Database connected successfully.');
    }
});

module.exports = db;
