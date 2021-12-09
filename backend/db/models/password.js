const { Model, DataTypes } = require('sequelize')

class Password extends Model {}

function createPasswordsTable(sequelize) {
	Password.init(
		{
			title: DataTypes.STRING,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			desc: DataTypes.STRING,
			userId: DataTypes.INTEGER,
		},
		{ sequelize, modelName: 'password' },
	)
}

module.exports = { createPasswordsTable, Password }
