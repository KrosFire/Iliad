import { StoreName } from '~/types'
import { GlobalStore } from '~/types/editorStore/global'
import { SettingsStore } from '~/types/editorStore/settings'
import { WorkspaceStore } from '~/types/editorStore/workspace'

import invoke from './invoke'

function updateState(type: 'global', newState: GlobalStore): Promise<void>
function updateState(type: 'workspace', newState: WorkspaceStore): Promise<void>
function updateState(type: 'settings', newState: SettingsStore): Promise<void>
function updateState(type: StoreName, newState: GlobalStore | WorkspaceStore | SettingsStore): Promise<void>

function updateState(type: StoreName, newState: GlobalStore | WorkspaceStore | SettingsStore) {
  switch (type) {
    case 'global':
      return invoke('update_state', { storeType: 'global', newState: JSON.stringify(newState) })
    case 'workspace':
      return invoke('update_state', { storeType: 'workspace', newState: JSON.stringify(newState) })
    case 'settings':
      return invoke('update_state', { storeType: 'settings', newState: JSON.stringify(newState) })
  }
}

export default updateState
