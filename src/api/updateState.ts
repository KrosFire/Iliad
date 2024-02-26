import { GlobalStore } from '~/types/editorStore/global'
import { WorkspaceStore } from '~/types/editorStore/workspace'

import invoke from './invoke'

const updateState = <T extends 'global' | 'local'>(
  type: T,
  newState: T extends 'global' ? GlobalStore : WorkspaceStore,
) => {
  switch (type) {
    case 'global':
      return invoke('update_state', { storeType: type, newState: JSON.stringify(newState) })
    case 'local':
      return invoke('update_state', { storeType: type, newState: JSON.stringify(newState) })
  }
}

export default updateState
