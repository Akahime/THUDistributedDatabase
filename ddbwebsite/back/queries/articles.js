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



exports.getAllArticles= function (req, res) {
    const category = req.params.category;
    var order = "timestamp";
    if(req.query.sort && req.query.sort == 'id') {
        console.log(req.query.sort);
        order = "id";
    }

    if (category !== "science" && category !== "technology") {
        return db.any('SELECT * FROM article WHERE language=\''+req.getLocale()+'\' ORDER BY '+order+' DESC LIMIT 50');
    }
    else {
        return db.any('SELECT * FROM article WHERE language=\''+req.getLocale()+'\' AND category=\''+category+'\' ORDER BY '+order+' DESC LIMIT 50');
    }
};

exports.insertArticles = function (req, res){
    var str = "";
    const start = req.body.startid;
    const end = parseInt(req.body.startid)+parseInt(req.body.number);

    for(var i=start;i<end-1;i++) {
        str +=  gen_an_article(i) + ", "
    }
    str +=  gen_an_article(end-1) + ";";
    console.log(str);

    db.none('INSERT INTO article VALUES '+str)
        .then(function () {
            req.flash('message', "Success inserting "+req.body.number+" articles starting from id "+start);
            res.redirect("/bulk-load");
        })
        .catch(function (err) {
            res.status(500).send(err.toString());
        });
};

/**# science:45%   technology:55%
# en:50%    zh:50%
# 50 tags
# 2000 authors */
function gen_an_article(i) {
    var lang = Math.random();
    var article = {};
    article["aid"] = i;
    article["timestamp"] = utils.random_timestamp(Date.parse("2010-01-01T08:00:00"));
    article["title"] = lang > 0.5 ? "Title of English article number "+ i : "中文文章第"+i+"号标题";
    article["category"] = Math.random() > 0.55 ? "science" : "technology";
    article["abstract"] = lang > 0.5 ? "The purpose of this study "+i+" is to identify relationships between the database and the website. The characteristics include the tools required for making reliable partitions of the data. The findings may be useful in treating further homework at Tsinghua University." :
        "这项研究的目的"+i+"号是确定数据库和网站之间的关系。 其特点包括大小，节点以及对数据进行可靠分区所需的工具。 这些发现可能对清华大学进一步的家庭作业有所帮助。";


    article["articleTags"] = "tags"+Math.floor(Math.random() * 50);
    article["authors"] = lang > 0.5 ? "English Author " + Math.floor(Math.random() * 2000) : "中国作家" + Math.floor(Math.random() * 2000);
    article["language"] = lang > 0.5 ?  "en":"zh";
    article["text"] = lang > 0.5 ? "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/texts/"+Math.floor(Math.random() * 5+5)+".html" : "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/texts/"+Math.floor(Math.random() * 5 +1)+".html";
    article["image"] = "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/pictures/"+Math.floor(Math.random() * 99+1)+".jpg" ;
    article["video"] = "";
    //We don't have videos all the time
    if(Math.random()>0.8) {
        article["video"] = lang > 0.5 ? "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/videos/"+Math.floor(Math.random() * 2+1)+".html" : "https://s3.ap-northeast-2.amazonaws.com/dfs-edai/videos/"+Math.floor(Math.random() * 2+2)+".html";
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