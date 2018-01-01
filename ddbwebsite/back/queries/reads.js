/**
 * Created by manu on 12/28/17.
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



exports.getAllReads= function (req, res, next) {
    return db.any('select * from read');
};

exports.insertReads = function (req, res){
    var str = "";
    const start = req.body.startid;
    const end = parseInt(req.body.startid)+parseInt(req.body.number);

    const startuid = parseInt(req.body.startuid);
    const enduid = parseInt(req.body.enduid);
    const startaid = parseInt(req.body.startaid);
    const endaid = parseInt(req.body.endaid);

    for(var i=start;i<end-1;i++) {
        str +=  gen_an_read(i, startuid, enduid, startaid, endaid) + ", "
    }
    str +=  gen_an_read(end-1, startuid, enduid, startaid, endaid) + ";";
    console.log(str);

    db.none('INSERT INTO read VALUES '+str)
        .then(function () {
            req.flash('message', "Success inserting "+req.body.number+" reads starting from id "+start);
            res.redirect("/bulk-load");
        })
        .catch(function (err) {
            res.status(500).send(err.toString());
        });
};

/**
 * # user agree/comment/share an read with the probability 0.3/0.3/0.2 
 * **/

function gen_an_read(i, startuid, enduid, startaid, endaid) {
    var read = {};
    read["id"] = i;
    read["timestamp"] = utils.random_timestamp(Date.parse("2017-01-01T08:00:00"));
    read["uid"] = startuid+Math.floor(Math.random() * (enduid-startuid)); //TODO : total num of users
    read["aid"] = startaid+Math.floor(Math.random() * (endaid-startaid)); //TODO : total num of articles
    read["readOrNot"] = "true";
    read["readTimeLength"] = Math.floor(Math.random() * 60) + "m" + Math.floor(Math.random() * 60) + "s";
    read["readSequence"] = Math.floor(Math.random() * 4);
    read["agreeOrNot"] = Math.random() < 0.3 ? "true" : "false";
    read["commentOrNot"] = Math.random() < 0.3 ? "true" : "false";
    read["shareOrNot"] = Math.random() < 0.2 ? "true" : "false";
    read["commentDetail"] = read["commentOrNot"] == "true" ? "commented by user " + read["uid"] + " on read " + read["aid"] : "";
    return "(" + read["id"] + ", " +
        "\'" + read["timestamp"] + "\', " +
        read["uid"] + ", " +
        read["aid"] + ", " +
        read["readOrNot"] + ", " +
        "\'" + read["readTimeLength"] + "\', " +
        "\'" + read["readSequence"] + "\', " +
        read["agreeOrNot"] + ", " +
        read["commentOrNot"] + ", " +
        read["shareOrNot"] + ", " +
        "\'" + read["commentDetail"] + "\')"
}