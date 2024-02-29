import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('setActiveWindow action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('If action sets correct window as active', async () => {
    const workspace = initWorkspaceState({
      files: {},
      windows: {
        win1: {
          __typename: 'TabsWindow',
          id: 'win1',
          tabs: [{ __typename: 'FileTab', id: 'file1' }],
          active: 0,
          parent: null,
        },
      },
      active: 'win2',
    })

    await workspace.setActiveWindow('win1')

    expect(workspace.active).toEqual('win1')
  })
})
