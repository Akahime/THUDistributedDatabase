/**
 * Created by manu on 12/31/17.
 */
'use strict';

var config = require('./../config/config');
var async = require('async');
var utils = require('../config/utils');

var promise = require('bluebird');

var options = {
    // Initialization Options
    promiseLib: promise
};

var pgp = require('pg-promise')(options);
var db = pgp(config.dbConfig);


const sqlstr= 'SELECT article.*, be_read.readnum, be_read.commentnum, be_read.agreenum, be_read.sharenum FROM article LEFT JOIN be_read ON article.id=be_read.aid ';

exports.getPopularDaily = function (req, res) {
    return db.any(sqlstr+'WHERE article.id = any(SELECT articleaidlist FROM popular_rank WHERE temporalgranularity = \'Daily\')');
};

exports.getPopularMonthly = function (req, res) {
    return db.any(sqlstr+'WHERE article.id = any(SELECT articleaidlist FROM popular_rank WHERE temporalgranularity = \'Monthly\')');
};

exports.getPopularWeekly = function (req, res) {
    return db.any(sqlstr+'WHERE article.id = any(SELECT articleaidlist FROM popular_rank WHERE temporalgranularity = \'Weekly\')');
};

exports.updatePopular = function (req, res, next){
    //Daily
    var oneDayAgo = new Date();
    oneDayAgo.setHours(0);
    console.log(oneDayAgo);

    db.any('SELECT aid FROM read WHERE timestamp > \''+oneDayAgo.toISOString()+'\' GROUP BY aid ORDER BY count(aid) DESC LIMIT 5')
        .then(function(daily){
            const listDaily = utils.list_from_data(daily, 'aid');
            console.log(listDaily);
            db.none('UPSERT INTO popular_rank values (1,CURRENT_TIMESTAMP(),\'Daily\',ARRAY['+listDaily+']);')
                .then(function(){

                    var oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
                    console.log(oneWeekAgo);

                    db.any('SELECT aid FROM read WHERE timestamp > \''+oneWeekAgo.toISOString()+'\' GROUP BY aid ORDER BY count(aid) DESC LIMIT 5')
                        .then(function(weekly){
                            const listWeekly= utils.list_from_data(weekly, 'aid');
                            console.log(listWeekly);
                            db.none('UPSERT INTO popular_rank values (2,CURRENT_TIMESTAMP(),\'Weekly\',ARRAY['+listWeekly+']);')
                                .then(function(){

                                    var oneMonthAgo = new Date();
                                    oneMonthAgo.setMonth(oneMonthAgo.getMonth()-1);
                                    console.log(oneMonthAgo);

                                    db.any('SELECT aid FROM read WHERE timestamp > \''+oneMonthAgo.toISOString()+'\' GROUP BY aid ORDER BY count(aid) DESC LIMIT 5')
                                        .then(function(monthly){
                                            const listMonthly= utils.list_from_data(monthly, 'aid');
                                            console.log(listMonthly);
                                            db.none('UPSERT INTO popular_rank values (3,CURRENT_TIMESTAMP(),\'Monthly\',ARRAY['+listMonthly+']);')
                                                .then(function(){
                                                    req.flash('message', "Updated Popular_rank !");
                                                    res.redirect("/bulk-load");
                                                })
                                                .catch(function (err) {
                                                    return next(err);
                                                });
                                        })
                                        .catch(function (err) {
                                            return next(err);
                                        });

                                })
                                .catch(function (err) {
                                    return next(err);
                                });
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                })
                .catch(function (err) {
                    return next(err);
                });
        })
        .catch(function (err) {
            return next(err);
        });
};