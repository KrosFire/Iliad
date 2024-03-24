import { SettingsActions } from '~/types'

import initState from './initState'
import registerPlugin from './registerPlugin'
import setOption from './setOption'

const actions: SettingsActions = {
  registerPlugin,
  setOption,
  initState,
}

export default actions
