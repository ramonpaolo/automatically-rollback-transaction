import express from 'express'

// Settings
import logger from './settings/logger.settings'
import { sequelize } from './settings/sequelize.settings'

// models
import UserModel from './models/user.model'

// middlewares
import { createRequestID, manageTransaction } from './middlewares/global.middlewares'

const { PORT } = process.env;

(async () => {
    logger.info('initializing application');

    await sequelize.sync()
})();

const app = express()

app.use(express.json())

app.get('/healthcheck', (_, res) => {
    res.status(200).json({
        status: 'success',
        message: 'project is working',
        uptime: process.uptime()
    })
})

app.use(createRequestID)
app.use(manageTransaction)

app.post('/v1/user/register', async (req, res) => {
    const { name } = req.body;

    try {
        await UserModel.create({
            name,
        }, {
            transaction: res.locals.transaction,
        })

        await res.locals.transaction.commit()

        return res.status(201).json({
            status: 'success',
            message: 'user created',
        })
    } catch (error) {
        await res.locals.transaction.rollback();

        return res.status(500).json({
            status: 'failed',
            message: 'some fake error',
        })
    }
})

const server = app.listen(PORT)

const signals: NodeJS.Signals[] = ['SIGTERM', 'SIGINT']

signals.forEach((signalToListen) => {
    process.on(signalToListen, async (signal) => {
        server.close(async () => {
            await sequelize.close()

            logger.warn({
                message: 'gracefully shutdown service',
                signal,
            })
        })
    })
})


export default server
