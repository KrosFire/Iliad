import { invoke as invokeRustCmd } from '@tauri-apps/api'
import { Commands } from '~/types'

const invoke = <C extends keyof Commands>(cmd: C, args: Commands[C]['arguments']): Promise<Commands[C]['return']> => {
  return invokeRustCmd<Commands[C]['return']>(cmd, args)
}

export default invoke
