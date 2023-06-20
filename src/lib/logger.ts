import mongoose from 'mongoose';
import winston from 'winston';
const { format } = winston;
import 'winston-mongodb';

const dbURL = process.env.MONGO_URI!;

export const logger = winston.createLogger({
    level: "info",
	format: winston.format.json(),
	defaultMeta: { service: "user-service" },
	transports: [
        new winston.transports.MongoDB({
			db: dbURL,
			options: {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				tls: false,
			},
			collection: "userLog"
		}),
        new winston.transports.File({ filename: "../error.log", level: "error" }),
		new winston.transports.File({
			filename: "../combined.log",
			format: format.combine(
				format.timestamp({ format: "MMM-DD-YYYY HH:mm.ss" }),
				format.align(),
				format.printf(
					(info) => `[${info.timestamp}] ${info.level}: ${info.message}`
				)
			),
		}),
    ]
})

// If not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}