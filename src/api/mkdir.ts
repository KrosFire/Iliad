import invoke from './invoke'

const mkdir = async (path: string) => {
  await invoke('mkdir', { path })
}

export default mkdir
