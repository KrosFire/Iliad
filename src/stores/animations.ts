import { AnimationsActions, AnimationsGetters, AnimationsState, Stores } from '~/types'
import { acceptHMRUpdate, defineStore } from 'pinia'

import actions from './animations/actions'
import getters from './animations/getters'

export const useAnimationsStore = defineStore<Stores.ANIMATIONS, AnimationsState, AnimationsGetters, AnimationsActions>(
  Stores.ANIMATIONS,
  {
    state: () => ({
      dragAndDrop: false,
    }),
    getters,
    actions,
  },
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAnimationsStore, import.meta.hot))
}
