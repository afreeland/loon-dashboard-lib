var jackrabbit = require('jackrabbit'),
    rabbit = jackrabbit(process.env.DASHBOARD_RABBIT_URL),
    exchange = rabbit.topic();

function Queue () {
    this.exchange = exchange;
}

Queue.prototype.publish = function (data, routingKey) {
    this.exchange.publish(data, {key: routingKey});
};

module.exports = new Queue();