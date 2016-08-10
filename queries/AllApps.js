var q = require('q');

function AllApps ( options ) {
    this._events = [];
    this._eventStore = options.eventStore;
}

AllApps.prototype._createViewModel = function () {
    var self = this,
        viewModel = [];

    self._events.forEach(function (e) {
        viewModel.push(e.data.data);
    });

    return viewModel;
};

AllApps.prototype.execute = function () {
    var deferred = q.defer(),
        streamId = 'systemapps',
        self = this;

    self._eventStore.connection.readStreamEventsForward(streamId, 0, 100, true, false, function (e) {
        self._events.push(e);
    }, self._eventStore.credentials, function () {
        deferred.resolve(self._createViewModel());
    });

    return deferred.promise;
};

module.exports = AllApps;