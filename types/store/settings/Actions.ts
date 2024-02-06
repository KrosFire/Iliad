import { ActionWithStore, SettingsStore } from '~/types'
import { _ActionsTree } from 'pinia'

export enum SettingsActionTypes {
  RegisterPlugin = 'registerPlugin',
}

type RegisterPlugin = (pluginName: string) => Promise<void>

export interface SettingsActions extends _ActionsTree {
  [SettingsActionTypes.RegisterPlugin]: ActionWithStore<RegisterPlugin, SettingsStore>
}

export default SettingsActions
