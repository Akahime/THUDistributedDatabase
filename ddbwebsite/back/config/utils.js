
exports.random_timestamp = function () {
    var from = Date.parse("2010-01-01T08:00:00");
    var to = Date.now();
    return (new Date(from + Math.random() * (to - from))).toISOString();
};