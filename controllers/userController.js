const UserService = require('../services/UserService');

class UserController {
    // Get all users
    static async getAllUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal server error');
        }
    }

    // Create a new user
    static async createUser(req, res) {
        const { name, email, password, role_id } = req.body;

        if (!name || !email || !password || !role_id) {
            return res.status(400).send('All fields are required');
        }

        try {
            await UserService.createUser({ name, email, password, role_id });
            res.status(201).send('User created successfully');
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).send('Internal server error');
        }
    }

    // Update a user's details
    static async updateUser(req, res) {
        const { id, name, email, role_id } = req.body;

        if (!id || !name || !email || !role_id) {
            return res.status(400).send('All fields are required');
        }

        try {
            await UserService.updateUser({ id, name, email, role_id });
            res.status(200).send('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).send('Internal server error');
        }
    }

    // Delete a user
    static async deleteUser(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.status(400).send('User ID is required');
        }

        try {
            await UserService.deleteUser(id);
            res.status(200).send('User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send('Internal server error');
        }
    }

    // Search users
    static async searchUsers(req, res) {
        const { name, email } = req.query;

        try {
            const users = await UserService.searchUsers({ name, email });
            res.status(200).json(users);
        } catch (error) {
            console.error('Error searching users:', error);
            res.status(500).send('Internal server error');
        }
    }
}

module.exports = UserController;
