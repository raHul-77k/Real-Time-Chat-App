const { DataTypes } = require('sequelize');
const sequelize = require('../util/database'); 
const User = require('./User');

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Chat.belongsTo(User, { foreignKey: 'userId' });

module.exports = Chat;
