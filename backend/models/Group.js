const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./User');

const Group = sequelize.define('Group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Define the many-to-many relationship between User and Group
Group.belongsToMany(User, { through: 'UserGroups' });
User.belongsToMany(Group, { through: 'UserGroups' });

module.exports = Group;
