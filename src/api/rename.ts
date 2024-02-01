import invoke from './invoke'

const rename = async (nodePath: string, newName: string): Promise<void> => {
  await invoke('rename', {
    path: nodePath,
    new_name: newName,
  })
}

export default rename
