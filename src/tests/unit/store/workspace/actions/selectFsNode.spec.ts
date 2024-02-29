import { initWorkspaceState } from '@/tests/helpers/initState'
import { WorkspaceState } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('selectFsNode action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('If selects single node correctly', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        name: 'root',
        children: [
          {
            __typename: 'FileSystemFile',
            path: '/file1',
            name: 'file1',
          },
          {
            __typename: 'FileSystemFile',
            path: '/file2',
            name: 'file2',
          },
        ],
      },
    } as WorkspaceState)

    await store.selectFsNode('/file2', 'single')

    expect(store.selectedFsNodes).toEqual([{ __typename: 'FileSystemFile', mass: false, path: '/file2' }])
    expect(store.lastSelectedFsNode).toEqual('/file2')

    await store.selectFsNode('/file1', 'single')

    expect(store.selectedFsNodes).toEqual([{ __typename: 'FileSystemFile', mass: false, path: '/file1' }])
    expect(store.lastSelectedFsNode).toEqual('/file1')
  })

  test('If selects multiple nodes correctly', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        name: 'root',
        children: [
          {
            __typename: 'FileSystemFile',
            path: '/file1',
            name: 'file1',
          },
          {
            __typename: 'FileSystemFile',
            path: '/file2',
            name: 'file2',
          },
        ],
      },
    } as WorkspaceState)

    await store.selectFsNode('/file2', 'multiple')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        mass: false,
        path: '/file2',
      },
    ])
    expect(store.lastSelectedFsNode).toEqual('/file2')

    await store.selectFsNode('/file1', 'multiple')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        mass: false,
        path: '/file2',
      },
      {
        __typename: 'FileSystemFile',
        mass: false,
        path: '/file1',
      },
    ])
    expect(store.lastSelectedFsNode).toEqual('/file1')
  })

  test('If selects multiple nodes correctly with shift key', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        children: [
          {
            __typename: 'FileSystemDirectory',
            path: '/dir1',
            children: [
              {
                __typename: 'FileSystemFile',
                path: '/dir1/file4',
              },
              {
                __typename: 'FileSystemFile',
                path: '/dir1/file5',
              },
            ],
          },
          {
            __typename: 'FileSystemDirectory',
            path: '/dir2',
            children: [
              {
                __typename: 'FileSystemFile',
                path: '/dir2/file6',
              },
              {
                __typename: 'FileSystemFile',
                path: '/dir2/file7',
              },
            ],
          },
          {
            __typename: 'FileSystemFile',
            path: '/file1',
          },
          {
            __typename: 'FileSystemFile',
            path: '/file2',
          },
          {
            __typename: 'FileSystemFile',
            path: '/file3',
          },
        ],
      },
    } as WorkspaceState)

    await store.selectFsNode('/file1', 'multiple')
    await store.selectFsNode('/dir1/file4', 'multiple')

    await store.selectFsNode('/dir2/file6', 'mass')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        mass: false,
        path: '/file1',
      },
      {
        __typename: 'FileSystemFile',
        mass: false,
        path: '/dir1/file4',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file5',
        mass: true,
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir2',
        mass: true,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir2/file6',
        mass: true,
      },
    ])
    expect(store.lastSelectedFsNode).toEqual('/dir1/file4')

    await store.selectFsNode('/dir2', 'mass')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        path: '/file1',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file4',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file5',
        mass: true,
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir2',
        mass: true,
      },
    ])
    expect(store.lastSelectedFsNode).toEqual('/dir1/file4')

    await store.selectFsNode('/', 'mass')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        path: '/file1',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file4',
        mass: false,
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
        mass: true,
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/',
        mass: true,
      },
    ])
  })

  test('If selects multiple nodes correctly filters out paths selected by with shift', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        children: [
          {
            __typename: 'FileSystemDirectory',
            path: '/dir1',
            children: [
              {
                __typename: 'FileSystemFile',
                path: '/dir1/file4',
              },
              {
                __typename: 'FileSystemFile',
                path: '/dir1/file5',
              },
            ],
          },
          {
            __typename: 'FileSystemDirectory',
            path: '/dir2',
            children: [
              {
                __typename: 'FileSystemFile',
                path: '/dir2/file6',
              },
              {
                __typename: 'FileSystemFile',
                path: '/dir2/file7',
              },
            ],
          },
          {
            __typename: 'FileSystemFile',
            path: '/file1',
          },
          {
            __typename: 'FileSystemFile',
            path: '/file2',
          },
          {
            __typename: 'FileSystemFile',
            path: '/file3',
          },
        ],
      },
    } as WorkspaceState)

    await store.selectFsNode('/file1', 'multiple')
    await store.selectFsNode('/dir1/file4', 'multiple')

    await store.selectFsNode('/file3', 'mass')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        path: '/file1',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file4',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file5',
        mass: true,
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir2',
        mass: true,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir2/file6',
        mass: true,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir2/file7',
        mass: true,
      },
      {
        __typename: 'FileSystemFile',
        path: '/file2',
        mass: true,
      },
      {
        __typename: 'FileSystemFile',
        path: '/file3',
        mass: true,
      },
    ])
    expect(store.lastSelectedFsNode).toEqual('/dir1/file4')

    await store.selectFsNode('/dir1/file5', 'mass')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemFile',
        path: '/file1',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file4',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/file5',
        mass: true,
      },
    ])
  })

  test('If selects only subfolder contents', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        children: [
          {
            __typename: 'FileSystemDirectory',
            path: '/dir1',
            children: [
              {
                __typename: 'FileSystemDirectory',
                path: '/dir1/dir2',
                children: [
                  {
                    __typename: 'FileSystemFile',
                    path: '/dir1/dir2/file1',
                  },
                  {
                    __typename: 'FileSystemFile',
                    path: '/dir1/dir2/file2',
                  },
                ],
              },
              {
                __typename: 'FileSystemFile',
                path: '/dir1/.aaa',
              },
            ],
          },
        ],
      },
    } as WorkspaceState)

    store.selectFsNode('/dir1/dir2', 'mass')
    store.selectFsNode('/dir1/dir2/file2', 'mass')

    expect(store.selectedFsNodes).toEqual([
      {
        __typename: 'FileSystemDirectory',
        path: '/dir1/dir2',
        mass: false,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/dir2/file1',
        mass: true,
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/dir2/file2',
        mass: true,
      },
    ])
    expect(store.lastSelectedFsNode).toEqual('/dir1/dir2')
  })
})
