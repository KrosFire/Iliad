import { WorkspaceGetters } from '~/types'

/**
 * Returns file id for a given path, if the file is already in the store.
 * Otherwise it returns `false`
 */
const getFileId: WorkspaceGetters['getFileId'] = state => filePath => {
  if (!state.files) return false

  for (const file of Object.values(state.files)) {
    if (file.path === filePath) return file.id
  }

  return false
}

export default getFileId
