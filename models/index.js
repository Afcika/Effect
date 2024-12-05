const { Sequelize } = require('sequelize');
const BookModel = require('./book');
const RoleModel = require('./role');
const CategoryModel = require('./category');
const ReservationModel = require('./reservation');

// Setup Sequelize connection
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql2'
});

// Initialize models
const Book = BookModel(sequelize);
const Role = RoleModel(sequelize);
const Category = CategoryModel(sequelize);
const Reservation = ReservationModel(sequelize);

// Setup relationships
Book.belongsTo(Category, { foreignKey: 'category_id' });
Reservation.belongsTo(Book, { foreignKey: 'book_id' });
Reservation.belongsTo(User, { foreignKey: 'user_id' }); // Assuming User model exists

// Sync the models with the database
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Tables created');
    })
    .catch((error) => {
        console.error('Error syncing tables:', error);
    });

module.exports = { sequelize, Book, Role, Category, Reservation };
