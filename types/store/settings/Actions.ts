import { ActionWithStore, SettingsState, SettingsStore } from '~/types'
import { SettingsStore as EditorSettingsStore } from '~/types/editorStore/settings'
import { _ActionsTree } from 'pinia'

type RegisterPlugin = (pluginName: string) => Promise<void>
type SetOption = <K extends Exclude<keyof SettingsState, 'plugins'>>(path: K, value: SettingsState[K]) => Promise<void>
type InitState = (savedState: EditorSettingsStore) => Promise<void>

export interface SettingsActions extends _ActionsTree {
  registerPlugin: ActionWithStore<RegisterPlugin, SettingsStore>
  setOption: ActionWithStore<SetOption, SettingsStore>
  initState: ActionWithStore<InitState, SettingsStore>
}

export default SettingsActions
