import invoke from './invoke'

const closeWindow = async () => {
  await invoke('close_window')
}

export default closeWindow
