import { NextFunction, Request, Response } from 'express';
import { sequelize } from '../settings/sequelize.settings';
import logger from '../settings/logger.settings';

const createRequestID = (req: Request, _: Response, next: NextFunction) => {
  req.headers['x-request-id'] = crypto.randomUUID();

  next()
}

const manageTransaction = async (req: Request, res: Response, next: NextFunction) => {
  res.locals.transaction = await sequelize.transaction();

  res.on('close', async () => {
      if (!res.locals.transaction.finished) {            
          await res.locals.transaction.rollback();

          logger.warn({
              message: 'rollback transaction because timeout of client',
              status: 'warn',
              request_id: req.headers['x-request-id'],
          })
      }
  })

  res.on('finish', async () => {
      if (!res.locals.transaction.finished) {
          await res.locals.transaction.commit();
      }
  })

  next()
}

export {
  createRequestID,
  manageTransaction,
}
