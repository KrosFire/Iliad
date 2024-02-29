vi.mock('@/api/fileInfo', () => ({
  default: vi.fn(),
}))
vi.mock('@/api/removeDir', () => ({
  default: vi.fn(),
}))
vi.mock('@/api/removeFile', () => ({
  default: vi.fn(),
}))

import fileInfo from '@/api/fileInfo'
import rmDir from '@/api/removeDir'
import rmFile from '@/api/removeFile'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('deleteFsNode action', () => {
  const fileInfoMock = fileInfo as MockedFunction<typeof fileInfo>
  const rmdirMock = rmDir as MockedFunction<typeof rmDir>
  const rmFileMock = rmFile as MockedFunction<typeof rmFile>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()

    fileInfoMock.mockImplementation(async (path: string) => {
      if (path === 'dir1') {
        return {
          // isDirectory: () => true,
          is_dir: true,
        } as any
      } else if (path === 'file1') {
        return {
          // isDirectory: () => false,
          // isFile: () => true,
          is_dir: false,
          is_file: true,
        } as any
      } else if (path === 'link1') {
        return {
          // isDirectory: () => false,
          // isFile: () => false,
          // isSymbolicLink: () => true,
          is_dir: false,
          is_file: false,
          is_symlink: true,
        } as any
      }
    })
  })

  it('Should check if a path exists', async () => {
    const store = initWorkspaceState()

    fileInfoMock.mockReturnValueOnce(false as any)

    await store.deleteFsNode('file1')

    expect(fileInfoMock).toHaveBeenCalledTimes(1)
    expect(fileInfoMock).toHaveBeenCalledWith('file1')

    expect(rmdirMock).not.toHaveBeenCalled()
    expect(rmFileMock).not.toHaveBeenCalled()
  })

  it('Should delete a file', async () => {
    const store = initWorkspaceState()

    await store.deleteFsNode('file1')

    expect(rmFileMock).toHaveBeenCalledTimes(1)
    expect(rmFileMock).toHaveBeenCalledWith('file1')
  })

  it('Should delete a directory recursively', async () => {
    const store = initWorkspaceState()

    await store.deleteFsNode('dir1')

    expect(rmdirMock).toHaveBeenCalledTimes(1)
    expect(rmdirMock).toHaveBeenCalledWith('dir1', true)
  })

  it('Should delete a symlink', async () => {
    const store = initWorkspaceState()

    await store.deleteFsNode('link1')

    expect(rmFileMock).toHaveBeenCalledTimes(1)
    expect(rmFileMock).toHaveBeenCalledWith('link1')
  })
})
