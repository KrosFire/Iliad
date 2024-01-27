/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

export interface Logger {
  debug(message?: string, ...args: any): void
  info(message?: string, ...args: any): void
  warn(message?: string, ...args: any): void
  error(message?: string, ...args: any): void
}

export const logger: Logger = {
  debug: (message, ...args) => console.debug('[Debug]', message, ...args),
  info: (message, ...args) => console.info('[Info]', message, ...args),
  warn: (message, ...args) => console.warn('[Warn]', message, ...args),
  error: (message, ...args) => console.error('[Error]', message, ...args),
}

export default logger
