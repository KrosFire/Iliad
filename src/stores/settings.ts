import { SettingsActions, SettingsGetters, SettingsState, Stores } from '~/types'
import { defineStore } from 'pinia'

import actions from './settings/actions'
import getters from './settings/getters'

export const useSettingsStore = defineStore<Stores.SETTINGS, SettingsState, SettingsGetters, SettingsActions>(
  Stores.SETTINGS,
  {
    state: () => ({
      plugins: [],
      animations: {
        dragAndDrop: null,
      },
    }),
    getters,
    actions,
  },
)
