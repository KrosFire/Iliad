vi.mock('@tauri-apps/api/path', () => ({
  basename: vi.fn(),
  dirname: vi.fn(),
  homeDir: vi.fn(),
}))

import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('createWorkspaceAction', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('Create workspace in specified directory', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {} as any,
      },
      windows: {
        win1: {
          __typename: 'TabsWindow',
          id: 'win1',
          tabs: [{ __typename: 'FileTab', id: 'file1' }],
          active: 0,
          parent: null,
        },
      },
      active: '',
    })

    const id = await workspace.createWorkspace('/home/user/workspace')

    expect(workspace.fileSystem?.path).toEqual('/home/user/workspace')
    expect(workspace.workspace).toEqual(id)
  })

  test('Create new window and workspace', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {} as any,
      },
      windows: {},
      active: '',
    })

    const id = await workspace.createWorkspace()

    expect(workspace.workspace).toEqual(id)
    expect(workspace.windows).toEqual({
      [id]: {
        __typename: 'TabsWindow',
        id,
        tabs: [{ __typename: 'PageTab', id: 'StartingPage' }],
        active: 0,
        parent: null,
      },
    })
  })
})
