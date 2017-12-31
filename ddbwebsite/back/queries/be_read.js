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

const be_read_columns = "(\"timestamp\",\"aid\",\"readnumtotal\",\"readnumdaily\",\"readnumweekly\",\"readnummonthly\",\"readuidlist\",\"commentnum\",\"commentuidlist\",\"agreenum\",\"agreeuidlist\",\"sharenum\",\"shareuidlist\")";

exports.getAllBeReads= function (req, res, next) {
    return db.any('select * from be_read');
};

exports.insertBeReads = function (req, res, next){

    db.any("SELECT aid, COUNT(aid), SUM(CASE WHEN \"readOrNot\" is true THEN 1 ELSE 0 END) AS readNum, " +
        "SUM(CASE WHEN \"commentOrNot\" is true THEN 1 ELSE 0 END) as commentnum, " +
        "SUM(CASE WHEN \"agreeOrNot\" is true THEN 1 ELSE 0 END) AS agreeNum, " +
        "SUM(CASE WHEN \"shareOrNot\" is true THEN 1 ELSE 0 END) as sharenum FROM read GROUP BY aid;")
        .then(function (result) {
            const monthyearstring = " (extract('month', CAST(timestamp AS DATE)) = extract('month', current_date())) AND (extract('year', CAST(timestamp AS DATE)) = extract('year', current_date())) ";
            async.forEach(result, (row) => {
                db.any("SELECT COUNT(aid) FROM read WHERE (extract('day', CAST(timestamp AS DATE)) = extract('day', current_date())) AND"+monthyearstring+"AND aid=\'"+row['aid']+"\' GROUP BY aid;")
                    .then(function (numdailyres) {
                        var numdaily = 0;
                        if( typeof numdailyres !== 'undefined' && numdailyres.length>0 ){
                            numdaily = numdailyres[0]['count(aid)'];
                        }


                        db.any("SELECT COUNT(aid) FROM read WHERE (extract('week', CAST(timestamp AS DATE)) = extract('week', current_date())) AND"+monthyearstring+"AND aid=\'"+row['aid']+"\' GROUP BY aid;")
                            .then(function (numweeklyres) {
                                var numweekly = 0;
                                if( typeof numweeklyres !== 'undefined' && numweeklyres.length>0) {
                                    numweekly = numweeklyres[0]['count(aid)'];
                                }


                                db.any("SELECT COUNT(aid) FROM read WHERE"+monthyearstring+"AND aid=\'"+row['aid']+"\' GROUP BY aid;")
                                    .then(function (nummonthlyres) {
                                        var nummonthly = 0;
                                        if( typeof nummonthlyres !== 'undefined' && nummonthlyres.length>0){
                                            nummonthly = nummonthlyres[0]['count(aid)'];
                                        }


                                        db.any("SELECT uid FROM read WHERE \"readOrNot\" IS TRUE AND aid = " + row['aid'] + " GROUP BY uid;")
                                            .then(function (data1) {
                                                const list1 = list_from_data(data1);

                                                db.any("SELECT uid FROM read WHERE \"readOrNot\" IS TRUE AND aid = " + row['aid'] + " GROUP BY uid;")
                                                    .then(function (data2) {
                                                        const list2 = list_from_data(data2);

                                                        db.any("SELECT uid FROM read WHERE \"commentOrNot\" IS TRUE AND aid = " + row['aid'] + " GROUP BY uid;")
                                                            .then(function (data3) {
                                                                const list3 = list_from_data(data3);


                                                                db.any("SELECT uid FROM read WHERE \"shareOrNot\" IS TRUE AND aid = " + row['aid'] + ";")
                                                                    .then(function (data4) {
                                                                        const list4 = list_from_data(data4);

                                                                        db.none("INSERT INTO be_read"+be_read_columns+" VALUES (CURRENT_TIMESTAMP(),"+ row['aid']+", "+row['readnum']+","+ numdaily+","+ numweekly+","+ nummonthly + ",ARRAY[" + list1 + "]," + row['readnum']
                                                                            + ",ARRAY[" + list2 + "]," + row['commentnum'] + ",ARRAY[" + list3 + "],"+ row['sharenum'] + ",ARRAY[" + list4 + "]);")
                                                                         .then(function () {
                                                                             console.log("SUCCESS for row ("+row['aid']+", "+row['readnum']+","+ numdaily+","+ numweekly+","+ nummonthly + ",ARRAY[" + list1 + "]," + row['readnum']
                                                                         + ",ARRAY[" + list2 + "]," + row['commentnum'] + ",ARRAY[" + list3 + "],"+ row['sharenum'] + ",ARRAY[" + list4 + "])");
                                                                             console.log(row);
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


function list_from_data(data) {
    var liste = "";
    var i = 0;
    data.forEach(function(row){
        liste = liste + row['uid'];
        i += 1;
        if (i < data.length) {
            liste = liste + ", "
        }
    });
    return liste
}

