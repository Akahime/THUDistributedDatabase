'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var config = require('./config/config');
var fs = require('fs');
var userController = require('./user/user.controller');
var commandController = require('./command/command.controller');
var constants = require('./config/constants');

module.exports = function(app) {
    // HTTP Request settings
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Templating settings
    app.set('view engine', 'jade');
    app.set('views', './public/views');

    // Static routes (__dirname is the 'project_path/back/' path)
    //app.use('/assets', express.static(__dirname + '/../bower_components'));
    app.use('/public', express.static(__dirname + '/../public/'));

    app.locals.prettyDate = prettyDate;
    app.locals.constants = constants;


    // HOME PAGE (with login links) ========
    app.get('/', function(req, res) {
        if(req.user){
            commandController.getUserCommands(req,res)
                .then(function(commands){
                    res.render('list_orders.jade', {
                        user : req.user,
                        orders: commands,
                        lang: res,
                        page: 'my'
                    });
                })
        }
        else{
            res.render('index.jade', {
                user : req.user,
                lang: res
            });
        }
    });


    // ORDER   ===============
    app.get('/order', isLoggedIn, function(req, res) {
        res.render('create_order.jade', {
            user : req.user,
            lang: res
        });
    });

    // ALL ORDERS (DESIGNER)   ===============
    app.get('/order/all', isLoggedIn, function(req, res) {
        if(req.user.role == constants.ROLE_DESIGNER) {
            commandController.getAll(req,res)
                .then(function(commands){
                    res.render('list_orders.jade', {
                        user : req.user,
                        orders: commands,
                        lang: res,
                        page: 'all'
                    });
                })
        }
        else {
            res.redirect('/error');
        }
    });

    // ALL ORDERS (DESIGNER)   ===============
    app.get('/order/assigned', isLoggedIn, function(req, res) {
        if(req.user.role == constants.ROLE_DESIGNER) {
            commandController.getAssignedCommands(req,res)
                .then(function(commands){
                    res.render('list_orders.jade', {
                        user : req.user,
                        orders: commands,
                        lang: res,
                        page: 'assigned'
                    });
                })
        }
        else {
            res.redirect('/error');
        }
    });

    // ORDER   ===============
    app.get('/order/:id', isLoggedIn, function(req, res) {
        commandController.getOne(req,res)
            .then(function(command){
                if(command.user_id == req.user.id || req.user.role == constants.ROLE_DESIGNER) {
                    res.render('page_order.jade', {
                        user : req.user,
                        order: command,
                        lang: res
                    });
                }
                else {
                    res.redirect('/error');
                }
            })
    });

    // ALL USERS (DESIGNER)  ===============
    app.get('/user/all', isLoggedIn, function(req, res) {
        userController.getAll(req,res)
            .then(function(users){
                if(req.user.role == constants.ROLE_DESIGNER) {
                    res.render('page_order.jade', {
                        user : req.user,
                        users: users,
                        lang: res
                    });
                }
                else {
                    res.redirect('/error');
                }
            })
    });

    // GALLERY ==============================
    app.get('/gallery', function(req, res) {
        res.render('gallery', {
            lang: res
        });
    });

    // CREDITS ==============================
    app.get('/credits', function(req, res) {
        res.render('credits', {
            lang: res
        });
    });

    //Render jade page  ===============
    app.post('/render',function(req,res) {
        if(req.body.page && req.body.property) {
            res.render(req.body.page+'.jade', {property : req.body.property, lang: res},function(err, layout){
                if (err) res.status(500).send(err);
                res.send(layout);
            });
        }
    });

    // ERROR ==============================
    app.get('/error', function(req, res) {
        res.render('error.jade', {user : req.user, lang:res});
    });


    // CHANGE TO ENGLISH   =================
    app.get('/en', function (req, res) {
        res.cookie('lang', 'en');
        var backURL=req.header('Referer') || '/';
        res.redirect(backURL)
    });


    // CHANGE TO SIMPLIFIFED CHINESE   =====
    app.get('/fr', function (req, res) {
        res.cookie('lang', 'fr');
        var backURL=req.header('Referer') || '/';
        res.redirect(backURL)
    });

    // TRANSLATIONS   ======================
    app.get('/translation',function(req,res) {
        var lang = getLangCookie(req);
        readJSONFile(__dirname + "/locales/"+ lang +".json", function (err, json) {
            if(err) {
                throw err;
            } else {
                res.json(json);
            }
        });
    });

    // API routes
    app.use('/api/users', require('./user'));
    app.use('/api/commands', require('./command'));
    app.use('/api/designer-commands', require('./designer-command'));

    //The 404 Route (ALWAYS Keep this as the last route)
    app.get('*', function(req, res){
        res.redirect('/error');
    });
};

function readJSONFile(filename, callback) {
    fs.readFile(filename, function (err, data) {
        if(err) {
            callback(err);
            return;
        }
        try {
            callback(null, JSON.parse(data));
        } catch(exception) {
            callback(exception);
        }
    });
}

function getLangCookie(request) {
    var lang = 'en',
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        if(parts[0] == 'lang' || parts[0] == ' lang'){
            lang = parts[1];
        }
    });

    return lang;
}

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        return next();
    }

    // if they aren't redirect them to the home page
    req.session.redirectTo = req.url;
    res.redirect('/login');
}

function prettyDate(dateString){
    //if it's already a date object and not a string you don't need this line:
    var date = new Date(dateString);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return date.getDate()+'/'+date.getMonth() + 1+'/'+y;
}