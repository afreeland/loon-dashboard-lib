var winston = require('winston');
require('winston-papertrail').Papertrail;

function Logger (  ) {

    this.logger = new winston.Logger({
        transports: [
            new winston.transports.Papertrail({
                host: process.env.DASHBOARD_PAPERTRAIL_URL,
                port: process.env.DASHBOARD_PAPERTRAIL_PORT,
                colorize: true
            }),
            new (winston.transports.Console)({
                colorize: true,
                level: 'verbose'
            })
        ]
    });
}

module.exports = new Logger().logger;