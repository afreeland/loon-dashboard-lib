/**
 * Created by looni on 8/16/2016.
 */
var q = require('q'),
    _ = require('lodash');

function TripsByUserId () {
    this._queryOptions = {
        limit: 10,
        page: 1,
        userId: null

    }
}

TripsByUserId.prototype.execute = function ( options ) {
    var deferred = q.defer(),
        self = this;

    var queryOptions = _.extend(self._queryOptions, options);
    console.log(queryOptions);

    var data = [
        {
            id: '000',
            userId: options.userId,
            name: 'Float Trip 2016 (2)',

            places: [
                {
                    name: 'New River Gorge',
                    startDate: new Date(),
                    endDate: new Date(),
                    dayCount: 2,
                    nightCount: 2,
                    activities: [{name: 'Kayaking'}, {name:'Fishing'}, {name: 'Camping'}],
                    trails: [{name: 'New River'}]
                }
            ],
            tripType: 'Leisure',

            // People who went on this trip
            people: [{name:'Me'}, {name: 'Fisher'}]
        },
        {
            id: '000',
            userId: options.userId,
            startDate: new Date(),
            endDate: new Date(),
            dayCount: 1,
            nightCount: 0,
            name: 'Kanawha State Forest',
            activities: [{name: 'Hiking'}, {name: 'Disc Golf'}],
            people: [{name: 'Me'}, {name: 'Lianne'}],
            trails: [{name: 'Gravel Road 35b'}, {name: 'Steep 1'}]
        },
        {
            id: '000',
            userId: options.userId,
            startDate: new Date(),
            endDate: new Date(),
            dayCount: 1,
            nightCount: 0,
            name: 'North Bend State Park',

        }
    ];



    // if (queryOptions.people) {
    //     // Load people
    //     // _.forEach(queryOptions.people, function (key) {
    //     //     data[0].people.push({key: })
    //     // })
    //     data[0].people.push({});
    //
    //     if (queryOptions.people.indexOf('id') > -1){ data[0].people[0].id='1234'};
    //     if (queryOptions.people.indexOf('name') > -1){ data[0].people[0].name='Anthony'};
    //     if (queryOptions.people.indexOf('relationship') > -1) { data[0].people[0].relationship='co-worker'};
    // }
    //
    // if (queryOptions.activities) {
    //     data[0].activities.push({});
    //
    //     if (queryOptions.activities.indexOf('name') > -1) { data[0].activities[0].name = 'kayaking'};
    // }



    deferred.resolve(data);

    return deferred.promise;
};

module.exports = TripsByUserId;