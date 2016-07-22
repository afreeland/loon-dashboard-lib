var q = require('q'),
    merge = require('merge');

function SystemAppById ( options ) {
    this._events = [];
    this._eventStore = options.eventStore;
}

SystemAppById.prototype._createViewModel = function () {
    var self = this,
        viewModel = null;

    self._events.forEach(function (event) {
        viewModel = merge(viewModel, event.data.data.data);
    });

    return viewModel;
};

SystemAppById.prototype.execute = function ( systemappId ) {
    var deferred = q.defer(),
        streamId = 'systemapp-' + systemappId,
        self = this;

    self._eventStore.connection.readStreamEventsForward(streamId, 0, 100, true, false, function (e) {
        self._events.push(e);
    }, self._eventStore.credentials, function (completed) {
        deferred.resolve(self._createViewModel());
    });

    return deferred.promise;
};

module.exports = SystemAppById;