import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('openTab action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Opens a tab in specified window', async () => {
    const state = initWorkspaceState({
      workspace: 'win1',
      files: {
        file1: {} as any,
        file2: {} as any,
      },
      windows: {
        win1: {
          __typename: 'TabsWindow',
          id: 'win1',
          tabs: [
            {
              __typename: 'FileTab',
              id: 'file1',
            },
          ],
          parent: null,
          active: 0,
        },
      },
      active: 'win1',
    })

    await state.openTab(
      'win1',
      {
        __typename: 'FileTab',
        id: 'file2',
      },
      0,
    )

    expect(state.windows['win1']).toEqual({
      __typename: 'TabsWindow',
      id: 'win1',
      tabs: [
        {
          __typename: 'FileTab',
          id: 'file2',
        },
        {
          __typename: 'FileTab',
          id: 'file1',
        },
      ],
      parent: null,
      active: 0,
    })
  })
})
