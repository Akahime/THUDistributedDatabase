'use strict';

var config = require('./config');
var async = require('async');

// Require the driver.
const pg = require('pg');

// Create a pool.
const pool = new pg.Pool(config.dbConfig);

// Closes communication with the database and exits.
var finish = function (done) {
    done();
    process.exit();
};

exports.createUser = async function () {
    return pool.withTransaction(async (client) => {
        await client.query(sql`
      CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name STRING(50) NOT NULL UNIQUE,
  gender BOOLEAN DEFAULT false, -- true: woman | false: man
  email STRING(100) NOT NULL UNIQUE,
  phone STRING(15) NOT NULL UNIQUE,
  language STRING(2) DEFAULT NULL,
  region STRING(15) DEFAULT NULL,
  dept INT DEFAULT 0,
  grade INT DEFAULT 0,
  role INT DEFAULT 0,
  preferTags STRING(15) DEFAULT NULL,
  obtainedCredits INT DEFAULT 0
);
    `)
    })
};

exports.insertUser = async function (req, res) {
    return pool.connect(function (err, client, done) {

        if (err) {
            console.error('could not connect to cockroachdb', err);
            finish(done);
        }
        async.waterfall([
                function (next) {
                    // Create the "accounts" table.
                    client.query(`INSERT INTO "user" VALUES (0, '2016-03-29 18:23:11', 'user0', true, 'email0', 'phone0', 'en', 'Hong Kong', 9, 4, 0, 'tags28', 80)`, next);
                },
                function (results, next) {
                    // Insert two rows into the "accounts" table.
                    client.query('SELECT * FROM "user"', next);
                },
            ],
            function (err, results) {
                if (err) {
                    console.error('error inserting into user', err);
                    finish(done);
                }

                console.log('Users');
                results.rows.forEach(function (row) {
                    console.log(row);
                });

                finish(done);
            });
    });

};

exports.queryDb = function (req, res) {
    const results = [];
    pool.connect(function (err, client, done) {

        if (err) {
            console.error('could not connect to cockroachdb', err);
            finish(done);
        }

        // SQL Query > Select Data
        client.query('SELECT * FROM "user"', (err, results) => {
            done();

            if (err) {
                console.log(err.stack)
            } else {
                results.rows.forEach(function (row) {
                    console.log(row);
                    return res.json(results);
                });
            }
        })

    });
};

/*
pool.connect(function (err, client, done) {
    // Closes communication with the database and exits.
    var finish = function () {
        done();
        process.exit();
    };

    if (err) {
        console.error('could not connect to cockroachdb', err);
        finish();
    }



    async.waterfall([
            function (next) {
                // Create the "accounts" table.
                client.query('CREATE TABLE IF NOT EXISTS "user" (id SERIAL PRIMARY KEY, timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, name STRING(50) NOT NULL UNIQUE, gender BOOLEAN DEFAULT false, email STRING(100) NOT NULL UNIQUE, phone STRING(15) NOT NULL UNIQUE, language STRING(2) DEFAULT NULL, region STRING(15) DEFAULT NULL, dept INT DEFAULT 0, grade INT DEFAULT 0, role INT DEFAULT 0, preferTags STRING(15) DEFAULT NULL, obtainedCredits INT DEFAULT );'
                    , next);
            },
            function (results, next) {
                // Insert two rows into the "accounts" table.
                client.query(`INSERT INTO "user" VALUES
                    (0, '2016-03-29 18:23:11', 'user0', true, 'email0', 'phone0', 'en', 'Hong Kong', 9, 4, 0, 'tags28', 80),
                    (1, '2012-08-10 21:50:07', 'user1', false, 'email1', 'phone1', 'en', 'Beijing', 15, 2, 0, 'tags48', 3),
                    (2, '2013-06-30 16:36:56', 'user2', true, 'email2', 'phone2', 'zh', 'Beijing', 16, 4, 1, 'tags45', 82),
                    (3, '2013-05-31 12:00:46', 'user3', false, 'email3', 'phone3', 'zh', 'Hong Kong', 1, 1, 0, 'tags37', 90),
                    (4, '2013-08-06 12:05:12', 'user4', false, 'email4', 'phone4', 'zh', 'Beijing', 15, 2, 1, 'tags26', 70);) `, next);
            },
            function (results, next) {
                // Print out the balances.
                client.query('SELECT id, timestamp, name FROM "user";', next);
            },
        ],
        function (err, results) {
            if (err) {
                console.error('error inserting into and selecting from user', err);
                finish();
            }

            console.log('Initial users:');
            results.rows.forEach(function (row) {
                console.log(row);
            });

            finish();
        });
}

)*/