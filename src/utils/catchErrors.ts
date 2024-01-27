import logger from './logger'

const catchErrors = async <T>(fn: ((...args: any[]) => Promise<T>) | Promise<T>): Promise<T | undefined> => {
  try {
    if (fn instanceof Promise) {
      return await fn
    }

    return await fn()
  } catch (error) {
    logger.error(`[catchErrors] ${error}`)
  }
}

export default catchErrors
