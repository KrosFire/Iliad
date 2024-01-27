import { FileSystemDirectory, FileSystemNode, WorkspaceGetters } from '~/types'

const findNode = (dir: FileSystemDirectory, path: string): FileSystemNode | null => {
  if (dir.path === path) return dir
  if (!dir.children) return null

  for (const child of dir.children) {
    if (child.path === path) return child
    if (child.__typename === 'FileSystemDirectory' && path.startsWith(child.path)) {
      const found = findNode(child, path)
      if (found) return found
    }
  }

  return null
}

const getFsNode: WorkspaceGetters['getFsNode'] = state => path => {
  if (!state.fileSystem) return null

  return findNode(state.fileSystem, path)
}

export default getFsNode
