import { initWorkspaceState } from '@/tests/helpers/initState'
import { Direction } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('moveWindow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Should move window and preserve the position', async () => {
    const workspace = initWorkspaceState({
      workspace: 'oldParent',
      files: {},
      windows: {
        oldParent: {
          __typename: 'ContainerWindow',
          id: 'oldParent',
          children: ['win1', 'win2', 'win3'],
          direction: Direction.HORIZONTAL,
          parent: null,
        },
        newParent: {
          __typename: 'ContainerWindow',
          id: 'newParent',
          children: ['win4', 'win5'],
          direction: Direction.VERTICAL,
          parent: null,
        },
        win2: {
          __typename: 'TabsWindow',
          id: 'win2',
          tabs: [],
          active: 0,
          parent: 'oldParent',
        },
      },
      active: '',
    })

    await workspace.moveWindow('win2', 'newParent')

    expect(workspace.windows).toEqual({
      oldParent: {
        __typename: 'ContainerWindow',
        id: 'oldParent',
        children: ['win1', 'win3'],
        direction: Direction.HORIZONTAL,
        parent: null,
      },
      newParent: {
        __typename: 'ContainerWindow',
        id: 'newParent',
        children: ['win4', 'win2', 'win5'],
        direction: Direction.VERTICAL,
        parent: null,
      },
      win2: {
        __typename: 'TabsWindow',
        id: 'win2',
        tabs: [],
        active: 0,
        parent: 'newParent',
      },
    })
  })

  it('Should move window to given position', async () => {
    const workspace = initWorkspaceState({
      workspace: 'oldParent',
      files: {},
      windows: {
        oldParent: {
          __typename: 'ContainerWindow',
          id: 'oldParent',
          children: ['win1', 'win2', 'win3'],
          direction: Direction.HORIZONTAL,
          parent: null,
        },
        newParent: {
          __typename: 'ContainerWindow',
          id: 'newParent',
          children: ['win4', 'win5'],
          direction: Direction.VERTICAL,
          parent: null,
        },
        win2: {
          __typename: 'TabsWindow',
          id: 'win2',
          tabs: [],
          active: 0,
          parent: 'oldParent',
        },
      },
      active: '',
    })

    await workspace.moveWindow('win2', 'newParent', 0)

    expect(workspace.windows).toEqual({
      oldParent: {
        __typename: 'ContainerWindow',
        id: 'oldParent',
        children: ['win1', 'win3'],
        direction: Direction.HORIZONTAL,
        parent: null,
      },
      newParent: {
        __typename: 'ContainerWindow',
        id: 'newParent',
        children: ['win2', 'win4', 'win5'],
        direction: Direction.VERTICAL,
        parent: null,
      },
      win2: {
        __typename: 'TabsWindow',
        id: 'win2',
        tabs: [],
        active: 0,
        parent: 'newParent',
      },
    })
  })
})
