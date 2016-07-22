var MongoClient = require('mongodb').MongoClient,
    logger = require('./logger'),
    q = require('q');

var database = null;

function _connect () {
    var deferred = q.defer();

    logger.info('Connecting to Mongo...');

    MongoClient.connect(process.env.DASHBOARD_MONGO_URL, function (err, db){
        if (err) throw new Error(err);

        database = db;
        logger.info('Connected to Mongo.');
        deferred.resolve(database);
    });

    return deferred.promise;
}

module.exports = {
    connect: _connect,
    db: database
};