const database = require('./database')

module.exports = {
    database,
    port: process.env.API_SERVER_PORT,
}
