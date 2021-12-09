const { Model, DataTypes } = require('sequelize')

class User extends Model {}

function createUsersTable(sequelize) {
	User.init({ username: DataTypes.STRING, password: DataTypes.STRING }, { sequelize, modelName: 'user' })
}

module.exports = { createUsersTable, User }
