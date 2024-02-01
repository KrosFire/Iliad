import { FileInfo } from '~/types'

import invoke from './invoke'

const fileInfo = async (path: string): Promise<FileInfo> => {
  const result = await invoke('file_info', { path })

  return result
}

export default fileInfo
