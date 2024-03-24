import { StoreName } from '~/types'

import invoke from './invoke'

const getState = async (type: StoreName) => {
  return invoke('get_state', { storeType: type })
}

export default getState
