import invoke from './invoke'

const pathExists = async (path: string): Promise<boolean> => {
  const result = await invoke('path_exists', {
    path,
  })

  return result
}

export default pathExists
