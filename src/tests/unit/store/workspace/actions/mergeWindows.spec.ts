import { initWorkspaceState } from '@/tests/helpers/initState'
import { Direction } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('merge Windows action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should merge windows correctly', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {} as any,
        file2: {} as any,
      },
      windows: {
        win1: {
          __typename: 'ContainerWindow',
          parent: null,
          children: ['win2'],
          id: 'win1',
          direction: Direction.HORIZONTAL,
        },
        win2: {
          __typename: 'TabsWindow',
          active: 0,
          tabs: [
            { __typename: 'FileTab', id: 'file1' },
            { __typename: 'FileTab', id: 'file2' },
          ],
          parent: 'win1',
          id: 'win2',
        },
      },
      workspace: 'win1',
      active: 'win2',
    })

    await workspace.mergeWindows('win1')

    expect(workspace.workspace).toEqual('win2')
    expect(workspace.windows).toEqual({
      win2: {
        __typename: 'TabsWindow',
        active: 0,
        tabs: [
          { __typename: 'FileTab', id: 'file1' },
          { __typename: 'FileTab', id: 'file2' },
        ],
        parent: null,
        id: 'win2',
      },
    })

    workspace.workspace = 'win0'
    workspace.active = 'win4'
    workspace.windows = {
      win0: {
        __typename: 'ContainerWindow',
        parent: null,
        children: ['win1'],
        id: 'win0',
        direction: Direction.HORIZONTAL,
      },
      win1: {
        __typename: 'ContainerWindow',
        parent: 'win0',
        children: ['win2'],
        id: 'win1',
        direction: Direction.HORIZONTAL,
      },
      win2: {
        __typename: 'ContainerWindow',
        parent: 'win1',
        children: ['win3', 'win4'],
        id: 'win2',
        direction: Direction.VERTICAL,
      },
      win3: {
        __typename: 'TabsWindow',
        active: 0,
        tabs: [
          { __typename: 'FileTab', id: 'file1' },
          { __typename: 'FileTab', id: 'file2' },
        ],
        parent: 'win2',
        id: 'win3',
      },
      win4: {
        __typename: 'TabsWindow',
        active: 0,
        tabs: [
          { __typename: 'FileTab', id: 'file2' },
          { __typename: 'FileTab', id: 'file1' },
        ],
        parent: 'win2',
        id: 'win4',
      },
    }

    await workspace.mergeWindows('win1')

    expect(workspace.workspace).toEqual('win0')
    expect(workspace.active).toEqual('win4')
    expect(workspace.windows).toEqual({
      win0: {
        __typename: 'ContainerWindow',
        parent: null,
        children: ['win2'],
        id: 'win0',
        direction: Direction.HORIZONTAL,
      },
      win2: {
        __typename: 'ContainerWindow',
        parent: 'win0',
        children: ['win3', 'win4'],
        id: 'win2',
        direction: Direction.VERTICAL,
      },
      win3: {
        __typename: 'TabsWindow',
        active: 0,
        tabs: [
          { __typename: 'FileTab', id: 'file1' },
          { __typename: 'FileTab', id: 'file2' },
        ],
        parent: 'win2',
        id: 'win3',
      },
      win4: {
        __typename: 'TabsWindow',
        active: 0,
        tabs: [
          { __typename: 'FileTab', id: 'file2' },
          { __typename: 'FileTab', id: 'file1' },
        ],
        parent: 'win2',
        id: 'win4',
      },
    })
  })
})
