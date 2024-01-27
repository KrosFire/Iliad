import { invoke as invokeRustCmd } from '@tauri-apps/api'
import { Queries } from '~/types'

const invoke = <C extends keyof Queries>(cmd: C, args: Queries[C]['arguments']): Promise<Queries[C]['return']> => {
  return invokeRustCmd<Queries[C]['return']>(cmd, args)
}

export default invoke
