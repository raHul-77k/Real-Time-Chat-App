const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./User');
const Group = require('./Group');

const GroupMessage = sequelize.define('GroupMessage', {
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
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Define associations
GroupMessage.belongsTo(User, { foreignKey: 'userId' });
GroupMessage.belongsTo(Group, { foreignKey: 'groupId' });

module.exports = GroupMessage;
