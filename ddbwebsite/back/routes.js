'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config/config');
var fs = require('fs');

var users = require('./queries/users');
var articles = require('./queries/articles');
var reads = require('./queries/reads');
var be_reads = require('./queries/be_read');
var popular_rank = require('./queries/popular_rank');


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


    // =========================== POPULAR-RANK ===============================//

    // Show all  ========
    app.get('/', function(req, res) {
        var popular = {};
        popular_rank.getPopularDaily(req, res)
            .then(function (data) {
                popular.daily = data;
                res.render('index.jade', {
                    lang: res,
                    result: {granularity: "Daily", articles: data}
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });

    app.get('/daily', function(req, res) {
        res.redirect('/');
    });

    app.get('/weekly', function(req, res) {
        var popular = {};
        popular_rank.getPopularWeekly(req, res)
            .then(function (data) {
                popular.daily = data;
                res.render('index.jade', {
                    lang: res,
                    result: {granularity: "Weekly", articles: data}
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });

    app.get('/monthly', function(req, res) {
        var popular = {};
        popular_rank.getPopularMonthly(req, res)
            .then(function (data) {
                popular.daily = data;
                res.render('index.jade', {
                    lang: res,
                    result: {granularity: "Monthly", articles: data}
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });

    // Insert ========
    app.get('/popular-rank/insert', function(req, res, next) {
        popular_rank.insertPopular(req, res, next);
    });


    // =========================== USERS ===============================//

    // Show all  ========
    app.get('/users', function(req, res) {
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
    app.post('/users/insert', function(req, res) {
        users.insertUsers(req, res);
    });

    // =========================== ARTICLES ===============================//

    // Show articles  ========
    app.get('/articles/:category', function(req, res) {
        articles.getAllArticles(req, res)
            .then(function (data) {
                res.render('articles.jade', {
                    lang: res,
                    result: data,
                    category: req.params.category
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });

    // Insert ========
    app.post('/articles/insert', function(req, res) {
        articles.insertArticles(req, res);
    });

    // =========================== READS ===============================//

    // Show all  ========
    app.get('/reads/all', function(req, res) {
        reads.getAllReads(req, res)
            .then(function (data) {
                res.render('reads.jade', {
                    lang: res,
                    result: data
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });


    // Insert ========
    app.post('/reads/insert', function(req, res) {
        reads.insertReads(req, res);
    });

    // =========================== BE-READS ===============================//

    // Show all  ========
    app.get('/be-reads/all', function(req, res) {
        be_reads.getAllBeReads(req, res)
            .then(function (data) {
                res.render('be-reads.jade', {
                    lang: res,
                    result: data
                });
            })
            .catch(function (err) {
                res.status(500).send(err.toString());
            });
    });


    // Insert ========
    app.get('/be-reads/insert', function(req, res, next) {
        be_reads.insertBeReads(req, res, next);
    });

    //======= BULK LOAD =====
    app.get('/bulk-load', function(req, res) {
        res.render('bulk-load.jade', {
            message: req.flash('message'),
            lang: res
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
    app.get('/zh', function (req, res) {
        res.cookie('lang', 'zh');
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

    //Render jade page  ===============
    app.post('/render',function(req,res) {
        if(req.body.page && req.body.article) {
            res.render(req.body.page+'.jade', {article : req.body.article, lang: res},function(err, layout){
                if (err) res.status(500).send(err);
                res.send(layout);
            });
        }
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
    var m = parseInt(date.getMonth() + 1);
    var y = date.getFullYear();
    return d+'/'+ m +'/'+y;
}