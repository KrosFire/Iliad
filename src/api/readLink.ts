import invoke from './invoke'

const readLink = async (path: string): Promise<string> => {
  const linkTarget = await invoke('read_link', { path })

  return linkTarget
}

export default readLink
