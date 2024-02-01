import invoke from './invoke'

const removeDir = async (path: string, recursive = false): Promise<void> => {
  const result = await invoke('remove_dir', { path, recursive })

  return result
}

export default removeDir
