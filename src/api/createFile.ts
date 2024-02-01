import invoke from './invoke'

const createFile = async (filePath: string): Promise<void> => {
  await invoke('create_file', { path: filePath })
}

export default createFile
