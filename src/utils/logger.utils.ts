/* eslint-disable curly */
import { Request } from 'express'

// Settings
import logger from '../settings/logger.settings'

const loggerError = (error: Error, message: string, optional?: object, request?: Request) => {
  if (request) {
    return logger.error({
      message,
      error: {
        error_name: error.name,
        error_message: error.message,
        error_stack: error.stack,
      },
      status: 'failed',
      data: optional,
      request_id: request.header('x-request-id'),
    })
  }

  return logger.error({
    message,
    error: {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack,
    },
    status: 'failed',
    data: optional,
  })
}

const loggerInfo = (message: string, optional?: object, request?: Request) => {
  if (!request) return logger.info({
    message,
    status: 'success',
    data: optional,
  })

  return logger.info({
    message,
    status: 'success',
    data: optional,
    request_id: request.header('x-request-id'),
  })
}

export {
  loggerInfo,
  loggerError,
}