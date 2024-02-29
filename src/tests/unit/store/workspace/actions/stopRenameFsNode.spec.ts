vi.mock('@/api/rename', () => ({
  default: vi.fn(),
}))

import rename from '@/api/rename'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { WorkspaceState } from '~/types'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('stopRenameFsNode action', () => {
  const renameMock = rename as MockedFunction<typeof rename>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should call fs.renameSync with correct arguments', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
        rename: true,
        children: [
          {
            __typename: 'FileSystemFile',
            path: '/dir1/file1',
            rename: true,
          },
        ],
      },
    } as WorkspaceState)

    await store.stopRenameFsNode('/dir1', 'dir3')
    expect(true).toBe(true)
    expect(renameMock).toHaveBeenCalledTimes(1)
    expect(renameMock).toHaveBeenCalledWith('/dir1', '/dir3')

    await store.stopRenameFsNode('/dir1/file1', 'file2')

    expect(renameMock).toHaveBeenCalledTimes(2)
    expect(renameMock).toHaveBeenCalledWith('/dir1/file1', '/dir1/file2')
  })

  it('should not call fs.renameSync if fsNode is not found or is not being renamed', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
        rename: false,
        children: [
          {
            __typename: 'FileSystemFile',
            path: '/dir1/file1',
            rename: false,
          },
        ],
      },
    } as WorkspaceState)

    await store.stopRenameFsNode('/dir1', 'dir3')

    expect(renameMock).not.toHaveBeenCalled()

    await store.stopRenameFsNode('/dir1/file1', 'file2')

    expect(renameMock).not.toHaveBeenCalled()
  })

  it('should unset rename property of fsNode', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
        rename: true,
        children: [
          {
            __typename: 'FileSystemFile',
            path: '/dir1/file1',
            rename: true,
          },
        ],
      },
    } as WorkspaceState)

    await store.stopRenameFsNode('/dir1', 'dir3')

    expect(store.getFsNode('/dir1')?.rename).toBe(false)

    await store.stopRenameFsNode('/dir1/file1', 'file2')

    expect(store.getFsNode('/dir1/file1')?.rename).toBe(false)
  })

  it('should update opened file paths', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
        rename: true,
        children: [
          {
            __typename: 'FileSystemFile',
            path: '/dir1/file1',
            rename: true,
          },
          {
            __typename: 'FileSystemFile',
            path: '/dir1/file2',
          },
          {
            __typename: 'FileSystemFile',
            path: '/dir1/file3',
          },
        ],
      } as WorkspaceState['fileSystem'],
      files: {
        '1': {
          id: '1',
          path: '/dir1/file1',
        },
        '2': {
          id: '2',
          path: '/dir1/file2',
        },
      } as unknown as WorkspaceState['files'],
    })

    store.updateOpenedFilePath = vi.fn()

    await store.stopRenameFsNode('/dir1', 'dir3')

    expect(store.updateOpenedFilePath).toHaveBeenCalledTimes(2)
    expect(store.updateOpenedFilePath).toHaveBeenNthCalledWith(1, '1', '/dir3/file1')
    expect(store.updateOpenedFilePath).toHaveBeenNthCalledWith(2, '2', '/dir3/file2')

    await store.stopRenameFsNode('/dir1/file3', 'file4')

    expect(store.updateOpenedFilePath).toHaveBeenCalledTimes(2)

    await store.stopRenameFsNode('/dir1/file1', 'file5')

    expect(store.updateOpenedFilePath).toHaveBeenCalledTimes(3)
    expect(store.updateOpenedFilePath).toHaveBeenNthCalledWith(3, '1', '/dir1/file5')
  })
})
