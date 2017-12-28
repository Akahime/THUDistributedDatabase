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



exports.getAllArticles= function (req, res, next) {
    return db.any('select * from article');
};

exports.insertArticles = function (req, res){
    var str = "";
    for(var i=0;i<10;i++) {
        str +=  gen_an_article(i) + ", "
    }
    str +=  gen_an_article(10) + ";";
    console.log(str);

    return db.none('INSERT INTO article VALUES '+str);
};

/**# science:45%   technology:55%
# en:50%    zh:50%
# 50 tags
# 2000 authors */
function gen_an_article(i) {
    var lang = Math.random();
    var article = {};
    article["aid"] = i;
    article["timestamp"] = utils.random_timestamp();
    article["title"] = lang > 0.5 ? "Title of English article number "+ i : "中文文章第"+i+"号标题";
    article["category"] = Math.random() > 0.55 ? "science" : "technology";
    article["abstract"] = lang > 0.5 ? "Abstract of article number " + i : "第"+i+"条摘要";
    article["articleTags"] = "tags"+Math.floor(Math.random() * 50);
    article["authors"] = lang > 0.5 ? "English Author %d" % Math.floor(Math.random() * 2000) : "中国作家%d" % Math.floor(Math.random() * 2000);
    article["language"] = lang > 0.5 ?  "en":"zh";
    article["text"] = lang > 0.5 ? "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/texts/"+5+Math.floor(Math.random() * 5)+".html" : "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/texts/"+1+Math.floor(Math.random() * 5)+".html";
    article["image"] = "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/pictures/"+1+Math.floor(Math.random() * 99)+".jpg" ;
    article["video"] = "";
    //We don't have videos all the time
    if(Math.random()>0.8) {
        article["video"] = lang > 0.5 ? "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/videos/"+1+Math.floor(Math.random() * 2)+".html" : "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/videos/"+2+Math.floor(Math.random() * 2)+".html";
    }

    return "(" + article["aid"] + ", " +
        "\'" + article["timestamp"] + "\', " +
        "\'" + article["title"] + "\', " +
        "\'" + article["category"] + "\', " +
        "\'" + article["abstract"] + "\', " +
        "\'" + article["articleTags"] + "\', " +
        "\'" + article["authors"] + "\', " +
        "\'" + article["language"] + "\', " +
        "\'" + article["text"] + "\', " +
        "\'" + article["image"] + "\', " +
        "\'" + article["video"] + "\')"
}
