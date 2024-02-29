import { initWorkspaceState } from '@/tests/helpers/initState'
import { Direction } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('createTabsWindow action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should create a new workspace window if no parent is given', async () => {
    const workspace = initWorkspaceState()

    const windowId = await workspace.createTabsWindow(
      null,
      [
        {
          __typename: 'FileTab',
          id: 'test',
        },
      ],
      0,
    )

    expect(workspace.windows).toEqual({
      [windowId]: {
        __typename: 'TabsWindow',
        id: windowId,
        parent: null,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'test',
          },
        ],
        active: 0,
      },
    })

    expect(workspace.workspace).toBe(windowId)
  })

  it('should add a new window to the parent window', async () => {
    const parentId = 'parent-id'

    const workspace = initWorkspaceState({
      windows: {
        [parentId]: {
          __typename: 'ContainerWindow',
          id: parentId,
          parent: null,
          children: [],
          direction: Direction.HORIZONTAL,
        },
      },
      workspace: parentId,
    })

    const windowId = await workspace.createTabsWindow(
      parentId,
      [
        {
          __typename: 'FileTab',
          id: 'test',
        },
      ],
      0,
    )

    expect(workspace.windows).toEqual({
      [parentId]: {
        __typename: 'ContainerWindow',
        id: parentId,
        parent: null,
        children: [windowId],
        direction: Direction.HORIZONTAL,
      },
      [windowId]: {
        __typename: 'TabsWindow',
        id: windowId,
        parent: parentId,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'test',
          },
        ],
        active: 0,
      },
    })
    expect(workspace.workspace).toBe(parentId)
  })

  it('should add new window at the end of the parent window', async () => {
    const parentId = 'parent-id'

    const workspace = initWorkspaceState({
      windows: {
        [parentId]: {
          __typename: 'ContainerWindow',
          id: parentId,
          parent: null,
          children: ['existingWindowId'],
          direction: Direction.HORIZONTAL,
        },
      },
      workspace: parentId,
    })

    const windowId = await workspace.createTabsWindow(parentId, [
      {
        __typename: 'FileTab',
        id: 'test',
      },
    ])

    expect(workspace.windows).toEqual({
      [parentId]: {
        __typename: 'ContainerWindow',
        id: parentId,
        parent: null,
        children: ['existingWindowId', windowId],
        direction: Direction.HORIZONTAL,
      },
      [windowId]: {
        __typename: 'TabsWindow',
        id: windowId,
        parent: parentId,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'test',
          },
        ],
        active: 0,
      },
    })
    expect(workspace.workspace).toBe(parentId)
  })
})
