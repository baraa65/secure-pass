const { createSharedPasswordsTable } = require('./models/shared-password')
const { createPasswordsTable } = require('./models/password')
const { createUsersTable } = require('./models/user')
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('secure-pass', 'root', '', { host: 'localhost', dialect: 'mariadb', logging: false })
sequelize.authenticate().then(() => console.log('SQL connected'))

createUsersTable(sequelize)
createPasswordsTable(sequelize)
createSharedPasswordsTable(sequelize)
sequelize.sync()

module.exports = { sequelize }
