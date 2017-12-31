var config = require('./config.json');

module.exports.dbConfig = {
    host: process.env.DB_HOST || config.database.host,
    port: process.env.DB_PORT || config.database.port,
    user: process.env.DB_USER || config.database.user,
    database: process.env.DB_NAME || config.database.dbName
};

module.exports.server = {
    port: process.env.SERVER_PORT || config.server.port,
    host: process.env.SERVER_HOST || config.server.host
};

module.exports.forceDb = process.env.FORCE_DB || config.forceDb;