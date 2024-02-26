import logger from '@/utils/logger'
import { invoke as invokeRustCmd } from '@tauri-apps/api'
import { Commands } from '~/types'

function invoke<C extends keyof Commands>(cmd: C): Promise<Commands[C]['return']>
async function invoke<C extends keyof Commands, A extends Record<string, unknown>>(
  cmd: C,
  args?: Commands[C] extends { arguments: A } ? A : undefined,
): Promise<Commands[C]['return']> {
  try {
    const res = await invokeRustCmd<Commands[C]['return']>(cmd, args)

    return res
  } catch (error) {
    logger.error('API invoke error:', error, ' cmd:', cmd, ' args:', args)

    throw error
  }
}

export default invoke
