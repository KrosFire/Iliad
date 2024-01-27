import { _ActionsTree } from 'pinia'

import { ActionWithStore, SettingsStore } from '~/types'

export enum SettingsActionTypes {
  RegisterPlugin = 'registerPlugin',
}

type RegisterPlugin = (pluginDirectory: string) => Promise<void>

export interface SettingsActions extends _ActionsTree {
  [SettingsActionTypes.RegisterPlugin]: ActionWithStore<RegisterPlugin, SettingsStore>;
}

export default SettingsActions