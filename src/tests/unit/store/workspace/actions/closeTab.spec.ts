import { initWorkspaceState } from '@/tests/helpers/initState'
import { Direction } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('closeTab action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Removes tab and a file', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {
        file1: {} as any,
        file2: {} as any,
      },
      windows: {
        abcd1234: {
          __typename: 'TabsWindow',
          id: 'abcd1234',
          active: 0,
          parent: null,
          tabs: [
            {
              __typename: 'FileTab',
              id: 'file1',
            },
            {
              __typename: 'FileTab',
              id: 'file2',
            },
          ],
        },
      },
      active: 'abcd1234',
    })

    const windowId = 'abcd1234'
    const index = 1

    await workspace.closeTab(windowId, index)

    expect(workspace.workspace).toEqual('abcd1234')
    expect(workspace.active).toEqual('abcd1234')
    expect(workspace.files).toEqual({
      file1: {},
    })
    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'TabsWindow',
        id: 'abcd1234',
        active: 0,
        parent: null,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'file1',
          },
        ],
      },
    })
  })

  it('Removes tab, file and workspace', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {
        file1: {} as any,
      },
      windows: {
        abcd1234: {
          __typename: 'TabsWindow',
          id: 'abcd1234',
          active: 0,
          parent: null,
          tabs: [
            {
              __typename: 'FileTab',
              id: 'file1',
            },
          ],
        },
      },
      active: 'abcd1234',
    })

    const windowId = 'abcd1234'
    const index = 0

    workspace.closeWindow = vi.fn()

    await workspace.closeTab(windowId, index)

    expect(workspace.closeWindow).toHaveBeenCalledOnce()
    expect(workspace.closeWindow).toHaveBeenCalledWith('abcd1234')
  })

  it('Removes child window and merge it', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {
        file1: {} as any,
        file2: {} as any,
      },
      windows: {
        abcd1234: {
          __typename: 'ContainerWindow',
          id: 'abcd1234',
          children: ['window1', 'window2'],
          parent: null,
          direction: Direction.HORIZONTAL,
        },
        window1: {
          __typename: 'TabsWindow',
          id: 'window1',
          active: 0,
          parent: 'abcd1234',
          tabs: [{ __typename: 'FileTab', id: 'file1' }],
        },
        window2: {
          __typename: 'TabsWindow',
          id: 'window2',
          active: 0,
          parent: 'abcd1234',
          tabs: [
            { __typename: 'FileTab', id: 'file2' },
            { __typename: 'FileTab', id: 'file3' },
            { __typename: 'PageTab', id: 'home' },
          ],
        },
      },
      active: 'abcd1234',
    })

    const windowId = 'window1'
    const index = 0

    await workspace.closeTab(windowId, index)

    expect(workspace.workspace).toEqual('window2')
    expect(workspace.files).toEqual({
      file2: {},
    })
    expect(workspace.windows).toEqual({
      window2: {
        __typename: 'TabsWindow',
        id: 'window2',
        active: 0,
        parent: null,
        tabs: [
          { __typename: 'FileTab', id: 'file2' },
          { __typename: 'FileTab', id: 'file3' },
          { __typename: 'PageTab', id: 'home' },
        ],
      },
    })
  })

  it('Removes only a tab in one window', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {
        file1: {} as any,
        file2: {} as any,
      },
      windows: {
        abcd1234: {
          __typename: 'ContainerWindow',
          id: 'abcd1234',
          children: ['window1', 'window2'],
          parent: null,
          direction: Direction.HORIZONTAL,
        },
        window1: {
          __typename: 'TabsWindow',
          id: 'window1',
          active: 0,
          parent: 'abcd1234',
          tabs: [
            { __typename: 'FileTab', id: 'file1' },
            { __typename: 'FileTab', id: 'file2' },
          ],
        },
        window2: {
          __typename: 'TabsWindow',
          id: 'window2',
          active: 0,
          parent: 'abcd1234',
          tabs: [{ __typename: 'FileTab', id: 'file1' }],
        },
      },
      active: 'abcd1234',
    })

    const windowId = 'window1'
    const index = 0

    await workspace.closeTab(windowId, index)

    expect(workspace.workspace).toEqual('abcd1234')
    expect(workspace.active).toEqual('abcd1234')
    expect(workspace.files).toEqual({
      file1: {} as any,
      file2: {} as any,
    })
    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'ContainerWindow',
        id: 'abcd1234',
        children: ['window1', 'window2'],
        parent: null,
        direction: Direction.HORIZONTAL,
      },
      window1: {
        __typename: 'TabsWindow',
        id: 'window1',
        active: 0,
        parent: 'abcd1234',
        tabs: [{ __typename: 'FileTab', id: 'file2' }],
      },
      window2: {
        __typename: 'TabsWindow',
        id: 'window2',
        active: 0,
        parent: 'abcd1234',
        tabs: [{ __typename: 'FileTab', id: 'file1' }],
      },
    })
  })

  it('Updates active tab index correctly', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {},
      windows: {
        abcd1234: {
          __typename: 'TabsWindow',
          id: 'abcd1234',
          parent: null,
          active: 2,
          tabs: [
            {
              __typename: 'FileTab',
              id: 'file1',
            },
            {
              __typename: 'FileTab',
              id: 'file2',
            },
            {
              __typename: 'FileTab',
              id: 'file3',
            },
          ],
        },
      },
      active: 'abcd1234',
      fileSystem: null,
    })

    await workspace.closeTab('abcd1234', 1)

    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'TabsWindow',
        id: 'abcd1234',
        parent: null,
        active: 1,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'file1',
          },
          {
            __typename: 'FileTab',
            id: 'file3',
          },
        ],
      },
    })

    await workspace.closeTab('abcd1234', 1)

    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'TabsWindow',
        id: 'abcd1234',
        parent: null,
        active: 0,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'file1',
          },
        ],
      },
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    workspace.windows['abcd1234'].tabs.push({
      __typename: 'FileTab',
      id: 'file2',
    })

    await workspace.closeTab('abcd1234', 0)

    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'TabsWindow',
        id: 'abcd1234',
        parent: null,
        active: 0,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'file2',
          },
        ],
      },
    })
  })
})
