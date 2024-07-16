import * as winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import * as process from 'process';

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;
const logLevel = process.env.NODE_ENV === 'development' ? 'verbose' : 'info';

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const dailyRotateFileTransport = new winstonDaily({
    level: 'info',
    datePattern: 'YYYY-MM-DD',
    dirname: logDir,
    filename: `%DATE%.log`,
    maxFiles: 30,
    zippedArchive: true,
});

const errorFileTransport = new winstonDaily({
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    dirname: `${logDir}/error`,
    filename: `%DATE%.error.log`,
    maxFiles: 30,
    zippedArchive: true,
});

const transports = [dailyRotateFileTransport, errorFileTransport];

if (process.env.NODE_ENV !== 'production') {
    const verboseFileTransport = new winstonDaily({
        level: 'verbose',
        datePattern: 'YYYY-MM-DD',
        dirname: logDir,
        filename: `%DATE%.log`,
        maxFiles: 30,
        zippedArchive: true,
    });

    transports.push(verboseFileTransport);
}

export const logger = winston.createLogger({
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

logger.add(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
        ),
    }),
);

