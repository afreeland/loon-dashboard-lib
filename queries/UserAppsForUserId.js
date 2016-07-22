var q = require('q'),
    merge = require('merge');

function UserAppsForUserId ( options ) {
    this._events = [];
    this._eventStore = options.eventStore;
}

UserAppsForUserId.prototype._createViewModel = function () {
    var self = this,
        viewModel = [];

    self._events.forEach(function (event) {
        if (event.data.systemapp) {
            viewModel.unshift(event.data);
        }

    });

    return viewModel;
};

UserAppsForUserId.prototype.execute = function ( userId ) {
    var deferred = q.defer(),
        streamId = 'userapp-' + userId,
        self = this;

    self._eventStore.connection.readStreamEventsForward(streamId, 0, 100, true, false, function (e) {
        self._events.push(e);
    }, self._eventStore.credentials, function (completed) {
        deferred.resolve(self._createViewModel());
    });

    return deferred.promise;
};

module.exports = UserAppsForUserId;