vi.mock('@/api/pathExists', () => ({
  default: vi.fn(),
}))

vi.mock('tauri-plugin-fs-watch-api', () => ({
  watch: vi.fn(),
}))

import existsSync from '@/api/pathExists'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { FileEncodings, KnownLanguages } from '~/types'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('updateOpenedFilePath action', () => {
  const existsSyncMock = existsSync as MockedFunction<typeof existsSync>
  // const chokidarWatchMock = watch as MockedFunction<typeof watch>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('should update file path', async () => {
    const store = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/dir1/file1',
          title: 'file1',
          dir: '/dir1',
          lang: KnownLanguages.Text,
          encoding: FileEncodings.UTF8,
          editorContent: '',
          removed: false,
          saved: false,
        },
      },
    })

    existsSyncMock.mockResolvedValueOnce(true)

    await store.updateOpenedFilePath('file1', '/dir2/file2')

    expect(store.files.file1.path).toBe('/dir2/file2')
  })

  it('should not update file path if file does not exist', async () => {
    const store = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/dir1/file1',
          title: 'file1',
          dir: '/dir1',
          lang: KnownLanguages.Text,
          encoding: FileEncodings.UTF8,
          editorContent: '',
          removed: false,
          saved: false,
        },
      },
    })

    existsSyncMock.mockResolvedValueOnce(false)

    await store.updateOpenedFilePath('file1', '/dir2/file2')

    expect(store.files.file1.path).toBe('/dir1/file1')
  })

  it('should not update file path if is not found in store', async () => {
    const store = initWorkspaceState()

    existsSyncMock.mockResolvedValueOnce(false)

    await store.updateOpenedFilePath('file1', '/dir2/file2')

    // Check that no error is thrown
    expect(true).toBe(true)
  })

  it('should update all properties of file', async () => {
    const store = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/dir1/file1',
          ext: '',
          title: 'file1',
          dir: '/dir1',
          lang: KnownLanguages.Text,
          encoding: FileEncodings.UTF8,
          editorContent: '',
          removed: false,
          saved: false,
        },
      },
    })

    existsSyncMock.mockResolvedValueOnce(true)

    await store.updateOpenedFilePath('file1', '/dir2/file2')

    expect(store.files.file1).toMatchObject({
      id: 'file1',
      path: '/dir2/file2',
      title: 'file2',
      dir: '/dir2',
      lang: KnownLanguages.Text,
      encoding: FileEncodings.UTF8,
      editorContent: '',
      removed: false,
      saved: false,
    })
  })
})
