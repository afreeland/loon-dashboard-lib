var q = require('q');

function AllApps ( db ) {
    this._db = db;
    this._collectionName = "apps";
}

AllApps.prototype.execute = function () {
    var self = this,
        deferred = q.defer();

    self._db.collection(self._collectionName).find({}, function (err, cursor) {
        if (err) {
            return deferred.reject(err);
        }

        cursor.toArray(function (err, data) {
            if (err) {
                return deferred.reject(err);
            }

            return deferred.resolve(data);
        });

    });

    return deferred.promise;
};

module.exports = AllApps;