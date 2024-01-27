import { ReadDirItem } from '~/types'

import invoke from './invoke'

const readDir = async (path: string): Promise<ReadDirItem[]> => {
  const result = await invoke('read_dir', { path })

  return result
}

export default readDir
