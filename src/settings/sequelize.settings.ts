import { Sequelize } from 'sequelize'

// utils
import { loggerError, loggerInfo } from '../utils/logger.utils';

const { NODE_ENV, POSTGRES_URL } = process.env;

let sequelize: Sequelize;

(async () => {
    try {
        sequelize = new Sequelize(String(POSTGRES_URL), {
            logging: true,
            dialect: 'postgres',
            dialectOptions: NODE_ENV === 'production' ? {
                ssl: {
                    require: false,
                    rejectUnauthorized: false,
                }
            } : {}
        })

        loggerInfo('connect on postgresql with success')

        await sequelize.authenticate()

        return sequelize;
    } catch (error) {
        loggerError(error, 'failed to connect in postgresql')

        throw error;
    }
})();

export {
    sequelize,
}
