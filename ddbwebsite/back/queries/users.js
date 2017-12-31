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



exports.getAllUsers = function (req, res, next) {
    return db.any('select * from "user"');
};

exports.insertUsers = function (req, res){ //TODO
    var str = "";
    for(var i=0;i<500;i++) {
        str +=  gen_an_user(i) + ", "
    }
    str +=  gen_an_user(500) + ";";
    console.log(str);

    return db.none('INSERT INTO "user" VALUES '+str);
};


/** Beijing:60%   Hong Kong:40%
# en:20%    zh:80%
# 20 depts
# 3 roles
# 50 tags
# 0~99 credits **/
function gen_an_user(i) {
    var user = {};
    user["uid"] = i;
    user["timestamp"] = utils.random_timestamp(Date.parse("2010-01-01T08:00:00"));
    user["name"] = "user" + i;
    user["gender"] = Math.random() > 0.33 ? 'false' : 'true';
    user["email"] = "email" + i;
    user["phone"] = "phone" + i;
    user["dept"] = Math.floor(Math.random() * 20);
    user["grade"] = Math.floor(Math.random() * 4 + 1);
    user["language"] = Math.random() > 0.8 ? "en" : "zh";
    user["region"] = Math.random() > 0.4 ? "Beijing" : "Hong Kong";
    user["role"] = Math.floor(Math.random() * 3);
    user["preferTags"] = "tags" + Math.floor(Math.random() * 50);
    user["obtainedCredits"] = Math.floor(Math.random() * 100);

    return "(" + user["uid"] + ", " +
            "\'" + user["timestamp"] + "\', " +
            "\'" + user["name"] + "\', " +
            user["gender"] + ", " +
            "\'" + user["email"] + "\', " +
            "\'" + user["phone"] + "\', " +
            "\'" + user["language"] + "\', " +
            "\'" + user["region"] + "\', " +
            user["dept"] + ", " +
            user["grade"] + ", " +
            user["role"] + ", " +
            "\'" + user["preferTags"] + "\', " +
            user["obtainedCredits"] + ")"
}