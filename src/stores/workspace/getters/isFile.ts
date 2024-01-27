import { WorkspaceGetters } from '~/types'

/**
 * Checks if given identifier corresponds with a file in store
 */
const isFile: WorkspaceGetters['isFile'] = state => id => Object.keys(state.files).includes(id)

export default isFile
