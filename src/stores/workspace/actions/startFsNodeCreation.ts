import { WorkspaceActions } from '~/types'

const startFsNodeCreation: WorkspaceActions['startFsNodeCreation'] = async function (path, type) {
  const fsNode = this.getFsNode(path)

  if (!fsNode || fsNode.__typename !== 'FileSystemDirectory') {
    return
  }

  fsNode.create = type
  this.openDirectory(path)
}

export default startFsNodeCreation
