import winston from 'winston';
import { hostname } from 'os';

const { DD_API_KEY, APP_ENV } = process.env

const serviceName = 'rollback-transaction'


const httpOptions: winston.transports.HttpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: `/api/v2/logs?dd-api-key=${DD_API_KEY}&ddsource=nodejs&service=${serviceName}-${APP_ENV}&hostname=${hostname()}`,
    ssl: true,
}

const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.prettyPrint()),
    transports: [
        new winston.transports.Console(),
        new winston.transports.Http(httpOptions)
    ],
    defaultMeta: {
        service: serviceName,
        env: APP_ENV,
    },
    silent: APP_ENV === 'test',
})

export default logger
