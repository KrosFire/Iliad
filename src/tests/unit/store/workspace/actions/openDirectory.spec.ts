vi.mock('@/api/readDir', () => ({
  default: vi.fn(),
}))
vi.mock('@/api/readLink', () => ({
  default: vi.fn(),
}))
vi.mock('tauri-plugin-fs-watch-api', () => ({
  watch: vi.fn(),
}))

import readDir from '@/api/readDir'
import { useWorkspaceStore } from '@/stores'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('openDirectory action', () => {
  const readdirMock = readDir as unknown as MockedFunction<typeof readDir>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('Adds directory', async () => {
    const watcherMock = vi.fn()

    readdirMock.mockImplementationOnce(
      () =>
        [
          {
            path: '/dir1/dir2/dir3',
            name: 'dir3',
            is_dir: true,
          },
        ] as any,
    )

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
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        name: '',
        parent: '',
        open: true,
        watcher: watcherMock as any,
        children: [
          {
            __typename: 'FileSystemDirectory',
            path: '/dir1',
            name: '',
            parent: '',
            open: true,
            watcher: watcherMock as any,
            children: [
              {
                __typename: 'FileSystemDirectory',
                path: '/dir1/dir2',
                name: '',
                parent: '',
                open: false,
                watcher: watcherMock as any,
                children: [],
              },
            ],
          },
        ],
      },
    })

    const store = useWorkspaceStore()
    await store.openDirectory('/dir1/dir2')

    expect((workspace.fileSystem as any).children[0].children[0].open).toBe(true)
    expect((workspace.fileSystem as any).children[0].children[0].children).toHaveLength(1)
    expect((workspace.fileSystem as any).children[0].children[0].children).toEqual([
      {
        __typename: 'FileSystemDirectory',
        name: 'dir3',
        path: '/dir1/dir2/dir3',
        parent: '/dir1/dir2',
        open: false,
        children: [],
      },
    ])
    expect(readdirMock).toHaveBeenCalledTimes(1)
  })
})
