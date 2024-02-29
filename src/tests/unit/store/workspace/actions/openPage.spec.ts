vi.mock('@tauri-apps/api/path', () => ({
  basename: vi.fn(),
  dirname: vi.fn(),
  homeDir: vi.fn(),
}))

import { initWorkspaceState } from '@/tests/helpers/initState'
import { Pages } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('openPage action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('opens a page', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {} as any,
      },
      windows: {
        win1: {
          __typename: 'TabsWindow',
          id: 'win1',
          tabs: [],
          active: 0,
          parent: null,
        },
      },
      active: 'win1',
    })

    await workspace.openPage(Pages.HOME, 'win1')

    expect(workspace.windows['win1']).toEqual({
      __typename: 'TabsWindow',
      id: 'win1',
      tabs: [
        {
          __typename: 'PageTab',
          id: Pages.HOME,
        },
      ],
      active: 0,
      parent: null,
    })
  })

  it('creates a workspace if no active workspace', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {} as any,
      },
      windows: {},
      active: null,
    })

    const createWorkspace = vi.spyOn(workspace, 'createWorkspace')

    await workspace.openPage(Pages.HOME)

    expect(createWorkspace).toHaveBeenCalledOnce()
  })
})
