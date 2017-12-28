exports.constants = {
    USERS_NUM : 10000,
    ARTICLES_NUM : 200000,
    READS_NUM : 1000000,
    INSERTS_NUM : 5000,
};

exports.random_timestamp = function () {
    var from = Date.parse("2010-01-01T08:00:00");
    var to = Date.now();
    return (new Date(from + Math.random() * (to - from))).toISOString();
};