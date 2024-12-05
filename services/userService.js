const db = require('../db/db');

class UserService {
    // Fetch all users with their role names
    static getAllUsers() {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT users.id, users.name, users.email, roles.role_name AS role
                FROM users
                JOIN roles ON users.role_id = roles.id
            `;
            db.query(query, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    // Create a new user with role_id
    static createUser({ name, email, password, role_id }) {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)';
            const values = [name, email, password, role_id];

            db.query(query, values, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    // Update user details with role_id
    static updateUser({ id, name, email, role_id }) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?';
            const values = [name, email, role_id, id];

            db.query(query, values, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    // Delete a user
    static deleteUser(id) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }

    // Search users by name or email
    static searchUsers({ name, email }) {
        let query = 'SELECT users.id, users.name, users.email, roles.role_name AS role FROM users JOIN roles ON users.role_id = roles.id WHERE 1=1';
        const queryParams = [];

        if (name) {
            query += ' AND users.name LIKE ?';
            queryParams.push(`%${name}%`);
        }

        if (email) {
            query += ' AND users.email LIKE ?';
            queryParams.push(`%${email}%`);
        }

        return new Promise((resolve, reject) => {
            db.query(query, queryParams, (error, results) => {
                if (error) {
                    return reject(error);
                }
                resolve(results);
            });
        });
    }
}

module.exports = UserService;
