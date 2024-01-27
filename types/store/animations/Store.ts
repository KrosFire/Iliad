import { Store } from 'pinia'

import { Stores } from '../Stores'
import AnimationsActions from './Actions'
import AnimationsState from './State'

export type AnimationsStore = Store<Stores.ANIMATIONS, AnimationsState, Record<string, never>, AnimationsActions>

export default AnimationsStore