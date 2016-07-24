var fs = require('fs'),
    q = require('q');

function DirectoryFileLoader ( options ) {
    this._path = options.path;
    this._logger = options.logger;
}

DirectoryFileLoader.prototype._walk = function(dir, done) {
    var self = this;

    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    self._walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });

    return results;
};

DirectoryFileLoader.prototype.load = function ( params ) {
    var self = this,
        deferred = q.defer();

    self._walk(self._path, function (err, files) {
        if (err) {
            self.logger.error(err);
            throw new Error(err);
        }

        files.forEach(function ( file ) {
            self._logger.verbose('Loading handler: ' + file);
            require(file)(params);
            self._logger.verbose('Handler loaded.');
        });

        deferred.resolve();
    });

    return deferred.promise;
};

module.exports = DirectoryFileLoader;