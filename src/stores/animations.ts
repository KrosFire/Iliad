import { AnimationsActions, AnimationsGetters, AnimationsState, Stores } from '~/types'
import { defineStore } from 'pinia'

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
