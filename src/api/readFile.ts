import { FileEncodings } from '~/types'

import invoke from './invoke'

const readFile = async (path: string, encoding: FileEncodings): Promise<string> => {
  const result = await invoke('read_file', { path, encoding })

  return result
}

export default readFile
