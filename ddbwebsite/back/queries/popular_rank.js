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



exports.getPopularDaily = function (req, res) {
    return db.any('SELECT * FROM article ' +
        'WHERE id = any(SELECT articleaidlist FROM popular_rank WHERE temporalgranularity = \'Daily\')');
};

exports.getPopularMonthly = function (req, res) {
    return db.any('SELECT * FROM article ' +
        'WHERE id = any(SELECT articleaidlist FROM popular_rank WHERE temporalgranularity = \'Monthly\')');
};

exports.getPopularWeekly = function (req, res) {
    return db.any('SELECT * FROM article ' +
        'WHERE id = any(SELECT articleaidlist FROM popular_rank WHERE temporalgranularity = \'Weekly\')');
};

exports.insertPopular = function (req, res, next){
    const insertStr = "INSERT INTO popular_rank(timestamp, temporalgranularity, articleaidlist) VALUES ";
    ([["Daily",'readnumdaily'],["Weekly",'readnumweekly'],["Monthly",'readnummonthly']]).forEach(function(granularity){
        db.any("SELECT aid FROM be_read ORDER BY " + granularity[1] + " DESC LIMIT 5;")
            .then(function (data) {
                const liste = utils.list_from_data(data, 'aid');

                console.log(insertStr+"(CURRENT_TIMESTAMP(), '"+granularity[0]+"', ARRAY[" + liste + "])");
                db.none(insertStr+"(CURRENT_TIMESTAMP(), '"+granularity[0]+"', ARRAY[" + liste + "])")
                    .then(function () {
                        res.redirect('/');
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            })
            .catch(function (err) {
                return next(err);
            });
    })
};