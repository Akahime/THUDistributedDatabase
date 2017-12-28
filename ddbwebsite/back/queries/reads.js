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
    for(var i=0;i<10;i++) { //TODO
        str +=  gen_an_read(i) + ", "
    }
    str +=  gen_an_read(10) + ";";
    console.log(str);

    return db.none('INSERT INTO read VALUES '+str);
};

/**
 * # user agree/comment/share an read with the probability 0.3/0.3/0.2 
 * **/

function gen_an_read(i) {
    var read = {};
    read["id"] = i;
    read["timestamp"] = utils.random_timestamp();
    read["uid"] = Math.floor(Math.random() * 10); //TODO : total num of users
    read["aid"] = Math.floor(Math.random() * 10); //TODO
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