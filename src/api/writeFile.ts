import { writeBinaryFile } from '@tauri-apps/api/fs'
import { FileEncodings } from '~/types'

import invoke from './invoke'

writeBinaryFile

const writeFile = async (path: string, contents: string, encoding: FileEncodings): Promise<void> => {
  await invoke('write_file', { path, contents, encoding })
}

export default writeFile
