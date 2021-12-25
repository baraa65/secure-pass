const { Model, DataTypes } = require('sequelize')

class SharedPassword extends Model {}

function createSharedPasswordsTable(sequelize) {
	SharedPassword.init(
		{
			passwordId: DataTypes.INTEGER,
			receiverId: DataTypes.INTEGER,
			senderId: DataTypes.INTEGER,
			content: DataTypes.TEXT,
			signature: DataTypes.TEXT,
		},
		{ sequelize, modelName: 'shared-password' },
	)
}

module.exports = { createSharedPasswordsTable, SharedPassword }
