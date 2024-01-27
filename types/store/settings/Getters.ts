import { GetterWithState, Plugin, SettingsState } from '~/types'
import { _GettersTree } from 'pinia'

export enum SettingsGetterTypes {
  getDragAndDropPlugin = 'getDragAndDropPlugin',
}

export type getDragAndDropPlugin = Plugin | undefined

export interface SettingsGetters extends _GettersTree<SettingsState> {
  [SettingsGetterTypes.getDragAndDropPlugin]: GetterWithState<getDragAndDropPlugin, SettingsState>
}

export default SettingsGetters
