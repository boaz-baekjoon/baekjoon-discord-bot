import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf } = winston.format;

const logDir = `${process.cwd()}/logs`;
const logLevel = process.env.NODE_ENV === 'development' ? 'verbose' : 'info';

const logFormat = printf((info) => {
    return `${info.timestamp as string} [${info.label as string}] ${info.level}: ${info.message as string}`;
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

const transports: winstonDaily[] = [dailyRotateFileTransport, errorFileTransport];

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
