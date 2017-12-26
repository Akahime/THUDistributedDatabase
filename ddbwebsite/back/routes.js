'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/config');
var fs = require('fs');
var constants = require('./config/constants');
var db = require('./config/db');

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


    // HOME PAGE  ========
    app.get('/', function(req, res) {
        db.queryDb()
            .then(function(result){
                res.render('index.jade', {
                    lang: res,
                    result: result
                });
            })

    });

    // CREATE DB ========
    app.get('/createuser', function(req, res) {
        db.createUser()
            .then(function(result){
                res.render('index.jade', {
                    lang: res,
                    result: result
                });
            })
    });

    // CREATE DB ========
    app.get('/insertuser', function(req, res) {
        db.insertUser()
            .then(function(result){
            res.render('index.jade', {
                lang: res,
                result: result
            });
        })
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

function prettyDate(dateString){
    //if it's already a date object and not a string you don't need this line:
    var date = new Date(dateString);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    return date.getDate()+'/'+date.getMonth() + 1+'/'+y;
}