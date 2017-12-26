'use strict';

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var config = require('./config/config');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var i18n = require('./config/i18n');

// Logger setup
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(cookieParser());

//Enable multi-language support
app.use(i18n);

require('./routes')(app);

app.use('/assets', express.static(__dirname + '/../bower_components'));
app.use(express.static(__dirname + '/../public'));

// Start server
server.listen(config.server.port, config.server.host, function () {
    console.log('DDB server listening on port ' + config.server.port);
});


// Expose app
module.exports = app;