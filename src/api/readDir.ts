import { ReadDirItem } from '~/types'

import invoke from './invoke'

function readDir(path: string, arg: { withTypes: true }): Promise<ReadDirItem[]>
function readDir(path: string, arg: { withTypes: false }): Promise<string[]>
function readDir(path: string): Promise<string[]>
async function readDir(path: string, arg?: { withTypes: boolean }): Promise<string[] | ReadDirItem[]> {
  const result = await invoke('read_dir', { path })

  if (arg?.withTypes) {
    return result
  }

  return result.map(item => item.name)
}

export default readDir
