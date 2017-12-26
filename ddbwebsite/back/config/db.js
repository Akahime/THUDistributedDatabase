'use strict';

var config = require('./config');
var Sequelize = require('sequelize-cockroachdb');

var database = new Sequelize(config.database.dbName, config.database.user, config.database.password, {
    dialect: 'postgres',
    port: config.database.port,
    logging: false
});

var User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    resetPasswordToken: {
        type: Sequelize.STRING
    },
    resetPasswordExpires: {
        type: Sequelize.DATE
    },
    role : {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true
});

var Command = database.define('command', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Sequelize.INTEGER
    },
    deadline: {
        type: Sequelize.DATE
    },
    type: {
        type: Sequelize.STRING
    },
    size_width: {
        type: Sequelize.INTEGER
    },
    size_height: {
        type: Sequelize.INTEGER
    },
    size_unit: {
        type: Sequelize.STRING
    },
    resolution: {
        type: Sequelize.INTEGER
    },
    output: {
        type: Sequelize.STRING
    },
    title: {
        type: Sequelize.STRING
    },
    comment: {
        type: Sequelize.TEXT
    },
    images: {
        type: Sequelize.JSON
    },
    progress: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true
});

var Designer_command = database.define('designer_command', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    designer_id: {
        type: Sequelize.INTEGER
    },
    command_id: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true
});

// Don't be attracted by the dark side of the force. The force needs to stay falsy here.
User.sync();
Command.sync();
Designer_command.sync();

module.exports.Command = Command;
module.exports.User = User;
module.exports.DesignerCommand = Designer_command;
module.exports.database = database;