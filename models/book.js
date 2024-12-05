import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        description: {
            type: DataTypes.TEXT
        },
        status: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
};
