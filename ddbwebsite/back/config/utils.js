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

exports.list_from_data = function(data, column) {
    var liste = "";
    var i = 0;
    data.forEach(function(row){
        liste = liste + row[column];
        i += 1;
        if (i < data.length) {
            liste = liste + ", "
        }
    });
    return liste
}
