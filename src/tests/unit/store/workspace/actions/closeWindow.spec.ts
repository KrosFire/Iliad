import { initWorkspaceState } from '@/tests/helpers/initState'
import { Direction } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('closeWindow action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should close selected window', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {},
      windows: {
        abcd1234: {
          __typename: 'ContainerWindow',
          id: 'abcd1234',
          parent: null,
          children: ['asd', 'abc', 'test'],
          direction: Direction.HORIZONTAL,
        },
        asd: {
          __typename: 'TabsWindow',
          id: 'asd',
          parent: 'abcd1234',
          tabs: [],
          active: 0,
        },
        abc: {
          __typename: 'TabsWindow',
          id: 'abc',
          parent: 'abcd1234',
          tabs: [],
          active: 0,
        },
        test: {
          __typename: 'TabsWindow',
          id: 'test',
          parent: 'abcd1234',
          tabs: [],
          active: 0,
        },
      },
      active: 'abcd1234',
    })

    await workspace.closeWindow('asd')

    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'ContainerWindow',
        id: 'abcd1234',
        parent: null,
        children: ['abc', 'test'],
        direction: Direction.HORIZONTAL,
      },
      abc: {
        __typename: 'TabsWindow',
        id: 'abc',
        parent: 'abcd1234',
        tabs: [],
        active: 0,
      },
      test: {
        __typename: 'TabsWindow',
        id: 'test',
        parent: 'abcd1234',
        tabs: [],
        active: 0,
      },
    })
  })

  it('should close parent window if it has one child left', async () => {
    const workspace = initWorkspaceState({
      workspace: 'abcd1234',
      files: {},
      windows: {
        abcd1234: {
          __typename: 'ContainerWindow',
          id: 'abcd1234',
          parent: null,
          children: ['asd', 'abc'],
          direction: Direction.HORIZONTAL,
        },
        asd: {
          __typename: 'TabsWindow',
          id: 'asd',
          parent: 'abcd1234',
          tabs: [],
          active: 0,
        },
        abc: {
          __typename: 'TabsWindow',
          id: 'abc',
          parent: 'abcd1234',
          tabs: [],
          active: 0,
        },
      },
      active: 'abcd1234',
    })

    await workspace.closeWindow('asd')

    expect(workspace.windows).toEqual({
      abc: {
        __typename: 'TabsWindow',
        id: 'abc',
        parent: null,
        tabs: [],
        active: 0,
      },
    })
    expect(workspace.workspace).toEqual('abc')
  })

  it('should remove all files and windows and create new workspace if closing last window', async () => {
    const workspace = initWorkspaceState({
      windows: {
        abcd1234: {
          __typename: 'TabsWindow',
          id: 'abcd1234',
          parent: null,
          tabs: [],
          active: 0,
        },
      },
      files: {
        file1: {} as any,
        file2: {} as any,
      },
    })

    workspace.createWorkspace = vi.fn()

    await workspace.closeWindow('abcd1234')

    expect(workspace.createWorkspace).toHaveBeenCalledOnce()
    expect(workspace.files).toEqual({})
  })
})
