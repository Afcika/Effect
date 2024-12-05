const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const categoryService = {
    fetchAll: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM category', (error, results) => {
                if (error) {
                    console.error('Error fetching categories:', error);
                    return reject('Error fetching categories');
                }
                resolve(results);
            });
        });
    },

    create: (name) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO category (name) VALUES (?)', [name], (error, result) => {
                if (error) {
                    console.error('Error creating category:', error);
                    return reject('Error creating category');
                }
                resolve('Category created successfully');
            });
        });
    },

    fetchBooksByCategory: (categoryId) => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM books WHERE category_id = ?', [categoryId], (error, results) => {
                if (error) {
                    console.error('Error fetching books for category:', error);
                    return reject('Error fetching books for category');
                }
                resolve(results);
            });
        });
    },

    update: (id, name) => {
        return new Promise((resolve, reject) => {
            db.query('UPDATE category SET name = ? WHERE id = ?', [name, id], (error, result) => {
                if (error) {
                    console.error('Error editing category:', error);
                    return reject('Error editing category');
                }
                resolve('Category updated successfully');
            });
        });
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM category WHERE id = ?', [id], (error, result) => {
                if (error) {
                    console.error('Error deleting category:', error);
                    return reject('Error deleting category');
                }
                resolve('Category deleted successfully');
            });
        });
    }
};

module.exports = categoryService;
