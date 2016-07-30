var logger = require('./logger'),
    EventStoreClient = require('event-store-client')
    eventStoreConnection = null;

var eventStoreOptions = {
    address: '127.0.0.1',
    port: 1113,
    debug: false,
    credentials: {
        username: 'admin',
        password: 'changeit'
    },
    onError: function (){
        logger.error('event store erreored!', arguments);
        //eventStoreConnection = new EventStoreClient.Connection(eventStoreOptions);
        //logger.info('supposed to connect again');
    }
};
logger.info('Connecting to event store...');
eventStoreConnection = new EventStoreClient.Connection(eventStoreOptions);
logger.info('Connected to event store.');

module.exports = {
    connection: eventStoreConnection,
    credentials: eventStoreOptions.credentials,
    createGuid: EventStoreClient.Connection.createGuid,
    expectedVersion: EventStoreClient.ExpectedVersion
};