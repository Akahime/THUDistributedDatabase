'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/config');
var fs = require('fs');
var users = require('./queries/users');
var articles = require('./queries/articles');


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

    // HOME PAGE  ========
    app.get('/', function(req, res) {
        res.render('index.jade', {
            lang: res,
            result: ""
        });
    });

    // =========================== USERS ===============================//

    // Show all  ========
    app.get('/users/all', function(req, res) {
        users.getAllUsers(req, res)
            .then(function (data) {
                res.render('users.jade', {
                    lang: res,
                    result: data
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });


    // Insert ========
    app.get('/users/insert', function(req, res) {
        users.insertUsers(req, res)
            .then(function () {
                res.render('index.jade', {
                    lang: res,
                    result: "UPDATED"
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });

    // =========================== ARTICLES ===============================//

    // Show all  ========
    app.get('/articles/all', function(req, res) {
        articles.getAllArticles(req, res)
            .then(function (data) {
                res.render('articles.jade', {
                    lang: res,
                    result: data
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });


    // Insert ========
    app.get('/articles/insert', function(req, res) {
        articles.insertArticles(req, res)
            .then(function () {
                res.render('index.jade', {
                    lang: res,
                    result: "UPDATED"
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
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

