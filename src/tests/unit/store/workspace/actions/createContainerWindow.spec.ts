import { initWorkspaceState } from '@/tests/helpers/initState'
import { Direction } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('createContainerWindow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("Should create container window and update children's parent", async () => {
    const workspace = initWorkspaceState({
      workspace: 'win1',
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

    const windowId = await workspace.createContainerWindow(null, 0, ['win1'], Direction.HORIZONTAL)

    expect(workspace.windows).toEqual({
      win1: {
        __typename: 'TabsWindow',
        id: 'win1',
        tabs: [{ __typename: 'FileTab', id: 'file1' }],
        active: 0,
        parent: windowId,
      },
      [windowId]: {
        __typename: 'ContainerWindow',
        id: windowId,
        children: ['win1'],
        direction: Direction.HORIZONTAL,
        parent: null,
      },
    })
  })
})
