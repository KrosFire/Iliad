import invoke from './invoke'

const getState = async (type: 'global' | 'local') => {
  return invoke('get_state', { storeType: type })
}

export default getState
