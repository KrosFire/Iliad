import invoke from './invoke'

const createWindow = async (path: string) => {
  await invoke('create_window', { path })
}

export default createWindow
