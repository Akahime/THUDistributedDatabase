/**
 * Created by manu on 12/29/17.
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

const be_read_columns = "(\"timestamp\",\"aid\",\"readnum\",\"readuidlist\",\"commentnum\",\"commentuidlist\",\"agreenum\",\"agreeuidlist\",\"sharenum\",\"shareuidlist\")";

exports.getAllBeReads= function (req, res, next) {
    return db.any('select * from be_read');
};


exports.insertBeReadsPartial = function (req, res, next){
    db.none("TRUNCATE TABLE be_read")
        .then(function(){
            db.any("SELECT aid, COUNT(aid), SUM(CASE WHEN \"readOrNot\" is true THEN 1 ELSE 0 END) AS readNum, " +
                "SUM(CASE WHEN \"commentOrNot\" is true THEN 1 ELSE 0 END) as commentnum, " +
                "SUM(CASE WHEN \"agreeOrNot\" is true THEN 1 ELSE 0 END) AS agreeNum, " +
                "SUM(CASE WHEN \"shareOrNot\" is true THEN 1 ELSE 0 END) as sharenum FROM read GROUP BY aid;")
                .then(function (result) {
                    var str="";
                    result.forEach(function(row){
                        str+="(CURRENT_TIMESTAMP(),"+ row['aid']+", "+row['readnum']+",ARRAY[]," + row['readnum']
                            + ",ARRAY[]," + row['commentnum'] + ",ARRAY[],"+ row['sharenum'] + ",ARRAY[]), ";
                    });
                    str = str.substring(0, str.length-2)+";";
                    console.log("Insert be-reads from bulk-load");
                    db.none("INSERT INTO be_read"+be_read_columns+" VALUES "+str)
                        .then(function () {
                            req.flash('message', "Success inserting be_reads");
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
};


exports.insertBeReads = function (req, res, next){
	console.log("start be reads");

    db.any("SELECT aid, COUNT(aid), SUM(CASE WHEN \"readOrNot\" is true THEN 1 ELSE 0 END) AS readNum, " +
        "SUM(CASE WHEN \"commentOrNot\" is true THEN 1 ELSE 0 END) as commentnum, " +
        "SUM(CASE WHEN \"agreeOrNot\" is true THEN 1 ELSE 0 END) AS agreeNum, " +
        "SUM(CASE WHEN \"shareOrNot\" is true THEN 1 ELSE 0 END) as sharenum FROM read GROUP BY aid;")
        .then(function (result) {
            var rowsProcessed = 1;
            async.forEach(result, (row) => {
                db.any("SELECT uid FROM read WHERE \"readOrNot\" IS TRUE AND aid = " + row['aid'] + " GROUP BY uid;")
                    .then(function (data1) {
                        const list1 = utils.list_from_data(data1, 'uid');

                        db.any("SELECT uid FROM read WHERE \"readOrNot\" IS TRUE AND aid = " + row['aid'] + " GROUP BY uid;")
                            .then(function (data2) {
                                const list2 = utils.list_from_data(data2, 'uid');

                                db.any("SELECT uid FROM read WHERE \"commentOrNot\" IS TRUE AND aid = " + row['aid'] + " GROUP BY uid;")
                                    .then(function (data3) {
                                        const list3 = utils.list_from_data(data3, 'uid');


                                        db.any("SELECT uid FROM read WHERE \"shareOrNot\" IS TRUE AND aid = " + row['aid'] + ";")
                                            .then(function (data4) {
                                                const list4 = utils.list_from_data(data4, 'uid');

                                                db.none("INSERT INTO be_read"+be_read_columns+" VALUES (CURRENT_TIMESTAMP(),"+ row['aid']+", "+row['readnum']+",ARRAY[" + list1 + "]," + row['readnum']
                                                    + ",ARRAY[" + list2 + "]," + row['commentnum'] + ",ARRAY[" + list3 + "],"+ row['sharenum'] + ",ARRAY[" + list4 + "]);")
                                                 .then(function () {
                                                     rowsProcessed ++;
                                                     console.log("SUCCESS for row number "+rowsProcessed+"("+row['aid']+", "+row['readnum']+ ",ARRAY[" + list1 + "]," + row['readnum']
                                                         + ",ARRAY[" + list2 + "]," + row['commentnum'] + ",ARRAY[" + list3 + "],"+ row['sharenum'] + ",ARRAY[" + list4 + "])");

                                                     req.flash('message', "Success inserting be_reads");
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


            }, err => {
                if (err) console.error(err.message);
            });
        })
        .catch(function (err) {
            return next(err);
        });
};
