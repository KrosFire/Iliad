import invoke from './invoke'

const removeFile = async (path: string): Promise<void> => {
  const result = await invoke('remove_file', { path })

  return result
}

export default removeFile
