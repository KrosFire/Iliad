import { SettingsActions, SettingsGetters, SettingsState, Stores } from '~/types'
import { acceptHMRUpdate, defineStore } from 'pinia'

import actions from './settings/actions'
import getters from './settings/getters'

export const useSettingsStore = defineStore<Stores.SETTINGS, SettingsState, SettingsGetters, SettingsActions>(
  Stores.SETTINGS,
  {
    state: () => ({
      plugins: [],
      animations: {
        dragAndDrop: 'DragAndDrop',
      },
      styles: {
        theme: 'IliadDark',
        tabSize: 4,
        fontSize: 14,
      },
    }),
    getters,
    actions,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot))
}
