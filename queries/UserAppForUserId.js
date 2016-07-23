var q = require('q'),
    merge = require('merge');

function UserAppForUserId ( options ) {
    this._events = [];
    this._eventStore = options.eventStore;
}

UserAppForUserId.prototype._createViewModel = function (systemappId) {
    var self = this,
        viewModel = {};

    self._events.forEach(function (event) {
        if (event.data.systemapp && event.data.systemapp.id == systemappId) {
            //viewModel.unshift(event.data);
            viewModel = merge(viewModel, event.data);
        }

    });

    return viewModel;
};

UserAppForUserId.prototype.execute = function ( userId, systemappId ) {
    var deferred = q.defer(),
        streamId = 'userapp-' + userId,
        self = this;

    self._eventStore.connection.readStreamEventsForward(streamId, 0, 100, true, false, function (e) {
        self._events.push(e);
    }, self._eventStore.credentials, function (completed) {
        deferred.resolve(self._createViewModel(systemappId));
    });

    return deferred.promise;
};

module.exports = UserAppForUserId;