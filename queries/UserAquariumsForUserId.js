/**
 * Created by looni on 7/25/2016.
 */
var q = require('q'),
    merge = require('merge'),
    _ = require('lodash');

function UserAquariumsForUserId ( options ) {
    this._events = [];
    this._eventStore = options.eventStore;
    this._queryOptions = {
        aquariumIds: []
    }
}

UserAquariumsForUserId.prototype._createViewModel = function () {
    var self = this,
        viewModel = [];

    self._events.forEach(function (event) {
        // if (event.data.systemapp) {
        //     viewModel.unshift(event.data);
        // }

        // if (self._queryOptions.aquariumIds.length > 0 ) {
        //     if (self._queryOptions.aquariumIds.indexOf(event.data.data.aquariumId) == -1) {
        //         return;
        //     }
        // }

        if ( event.eventType == 'aquarium.created' ) {
            viewModel.unshift(event.data.data);
        } else if (event.eventType == 'aquarium.inventory.created' ){
            var aquariumVm = _.find(viewModel, {id: event.data.data.aquariumId});

            //if (!aquariumVm) throw new Error('expected aquarium to exist');
            if (!aquariumVm) return;

            aquariumVm.inventory = aquariumVm.inventory || [];

            aquariumVm.inventory.push(event.data.data);

            console.log();
        } else {
            throw new Error('unknown event in this stream');
        }

        //viewModel.unshift(event.data.data);
    });



    return viewModel;
};

UserAquariumsForUserId.prototype.execute = function ( userId, options ) {
    var deferred = q.defer(),
        streamId = 'useraquarium-' + userId,
        self = this;

    self._queryOptions = merge(self._queryOptions, options);

    self._queryOptions.aquariumIds = _.isString(self._queryOptions.aquariumIds) ? [self._queryOptions.aquariumIds] : self._queryOptions.aquariumIds;

    self._eventStore.connection.readStreamEventsForward(streamId, 0, 100, true, false, function (e) {
        // if (self._queryOptions.aquariumIds.length > 0 ) {
        //     if (self._queryOptions.aquariumIds.indexOf(e.data.data.aquariumId) == -1) {
        //         return;
        //     } else {
        //         self._events.push(e);
        //     }
        // } else {
        //     self._events.push(e);
        // }

        if ( e.eventType == 'aquarium.created' ) {
            if (self._queryOptions.aquariumIds.length > 0 ) {
                // Looks like we need to filter
                if (self._queryOptions.aquariumIds.indexOf(e.data.data.id) == -1) {
                    // not found
                } else {
                    self._events.push(e);
                }
            } else {
                self._events.push(e);
            }
        } else {
            self._events.push(e);
        }

    }, self._eventStore.credentials, function (completed) {
        deferred.resolve(self._createViewModel());
    });

    return deferred.promise;
};

module.exports = UserAquariumsForUserId;