import { FileSystemNode, WorkspaceGetters } from '~/types'

import compareFsNodes from '../helpers/compareFsNodes'

const getFilesOnPath: WorkspaceGetters['getFilesOnPath'] = state => (startPath, endPath) => {
  if (!state.fileSystem) return []

  if (startPath.path === endPath.path) return [startPath]

  if (compareFsNodes(startPath, endPath) > 0) {
    return getFilesOnPath(state)(endPath, startPath)
  }

  const appendPaths = (acc: FileSystemNode[], fsNode: FileSystemNode) => {
    if (compareFsNodes(startPath, fsNode) < 0 && compareFsNodes(endPath, fsNode) > 0) {
      acc.push(fsNode)
    }

    if (fsNode.__typename === 'FileSystemDirectory') {
      fsNode.children.reduce<FileSystemNode[]>((acc, fsNode) => {
        appendPaths(acc, fsNode)
        return acc
      }, acc)
    }

    return acc
  }

  return state.fileSystem.children.reduce<FileSystemNode[]>(appendPaths, [])
}

export default getFilesOnPath
