vi.mock('@/api/removeDir', () => ({
  default: vi.fn(),
}))

vi.mock('@/api/removeFile', () => ({
  default: vi.fn(),
}))

import rmDir from '@/api/removeDir'
import rmFile from '@/api/removeFile'
import { useWorkspaceStore } from '@/stores'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('removeFsNode action', () => {
  const unlinkMock = rmFile as MockedFunction<typeof rmFile>
  const rmdirMock = rmDir as MockedFunction<typeof rmDir>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('Removes file', async () => {
    const watcherMock = {
      close: vi.fn(),
    }

    initWorkspaceState({
      workspace: '',
      files: {},
      windows: {},
      active: '',
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
            open: false,
            children: [],
          },
          {
            __typename: 'FileSystemDirectory',
            path: '/dir2',
            name: '',
            parent: '',
            open: false,
            children: [],
          },
          {
            __typename: 'FileSystemFile',
            path: '/file1',
            name: '',
            parent: '',
            isLink: false,
          },
          {
            __typename: 'FileSystemFile',
            path: '/file2',
            name: '',
            parent: '',
            isLink: false,
          },
        ],
      },
    })

    const store = useWorkspaceStore()

    await store.removeFsNode('/file2')

    expect(unlinkMock).toHaveBeenCalledWith('/file2')
    expect(rmdirMock).not.toHaveBeenCalled()
  })

  it('Removes dir', async () => {
    const watcherMock = {
      close: vi.fn(),
    }

    initWorkspaceState({
      workspace: '',
      files: {},
      windows: {},
      active: '',
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
            open: false,
            children: [],
          },
          {
            __typename: 'FileSystemDirectory',
            path: '/dir2',
            name: '',
            parent: '',
            open: false,
            children: [],
          },
          {
            __typename: 'FileSystemFile',
            path: '/file1',
            name: '',
            parent: '',
            isLink: false,
          },
          {
            __typename: 'FileSystemFile',
            path: '/file2',
            name: '',
            parent: '',
            isLink: false,
          },
        ],
      },
    })

    const store = useWorkspaceStore()

    await store.removeFsNode('/dir2')

    expect(rmdirMock).toHaveBeenCalledWith('/dir2', true)
    expect(unlinkMock).not.toHaveBeenCalled()
  })
})
