const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const process = require('process');
const {log} = require("winston");

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;
const logLevel = process.env.NODE_ENV === 'development' ? 'verbose' : 'info';

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});


const transports = [
    new winstonDaily({
        level: 'info',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir,
        filename: `%DATE%.log`,
        maxFiles: 30,
        zippedArchive: true,
    }),

    new winstonDaily({
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir + '/error',
        filename: `%DATE%.error.log`,
        maxFiles: 30,
        zippedArchive: true,
    }),
];


if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winstonDaily({
            level: 'verbose',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    );
}

const logger = winston.createLogger({
    level: logLevel,
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        label({ label: 'BOJ Bot Log' }),
        logFormat,
    ),
    transports,
    exceptionHandlers: [
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: logDir,
            filename: `%DATE%.exception.log`,
            maxFiles: 30,
            zippedArchive: true,
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
    );
}


module.exports = logger;