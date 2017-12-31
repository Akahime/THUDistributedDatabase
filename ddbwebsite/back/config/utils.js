exports.constants = {
    USERS_NUM : 10000,
    ARTICLES_NUM : 200000,
    READS_NUM : 1000000,
    INSERTS_NUM : 5000,
};

exports.random_timestamp = function (from) {
    var to = Date.now();
    return (new Date(from + Math.random() * (to - from))).toISOString();
};