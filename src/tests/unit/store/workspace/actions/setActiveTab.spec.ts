import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('setActiveTab action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('If action sets correct tab as active', async () => {
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
      active: 'win1',
    })

    await workspace.setActiveTab('win1', 1)

    expect(workspace.windows['win1']).toEqual({
      __typename: 'TabsWindow',
      id: 'win1',
      tabs: [{ __typename: 'FileTab', id: 'file1' }],
      active: 1,
      parent: null,
    })
  })
})
