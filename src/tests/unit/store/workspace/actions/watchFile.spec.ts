vi.mock('tauri-plugin-fs-watch-api', () => ({
  watch: vi.fn(),
}))

vi.mock('@/api/readFile', () => ({
  default: vi.fn(() => 'file content'),
}))

vi.mock('@/api/pathExists', () => ({
  default: vi.fn(() => true),
}))

import pathExists from '@/api/pathExists'
import readFile from '@/api/readFile'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { FileEncodings, KnownLanguages } from '~/types'
import { createPinia, setActivePinia } from 'pinia'
import { watch } from 'tauri-plugin-fs-watch-api'
import { MockedFunction } from 'vitest'

describe('startRenameFsNode action', () => {
  const chokidarWatch = watch as MockedFunction<typeof watch>
  const fsReadFile = readFile as MockedFunction<typeof readFile>
  const fsPathExists = pathExists as MockedFunction<typeof pathExists>

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('start file observation', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/path/to/file1',
          encoding: FileEncodings.UTF8,
          editorContent: 'file content',
          saved: true,
          removed: false,
          title: 'title',
          dir: '/path/to',
          lang: KnownLanguages.MySQL,
        },
      },
      windows: {},
      active: null,
    })

    await workspace.watchFile('file1')

    expect(workspace.files['file1'].watcher).not.toBeNull()
    expect(chokidarWatch).toHaveBeenCalledWith('/path/to/file1', expect.any(Function), {
      delayMs: 100,
    })
  })

  it('update file content when file is changed', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/path/to/file1',
          encoding: FileEncodings.UTF8,
          editorContent: 'file content',
          saved: true,
          removed: false,
          title: 'title',
          dir: '/path/to',
          lang: KnownLanguages.MySQL,
        },
      },
      windows: {},
      active: null,
    })

    chokidarWatch.mockImplementationOnce(((_: string | string[], callback: () => any) => {
      callback()
    }) as any)

    fsReadFile.mockResolvedValueOnce('changed file content')

    await workspace.watchFile('file1')

    expect(fsReadFile).toHaveBeenCalledWith('/path/to/file1', 'utf8')
    expect(workspace.files['file1'].editorContent).toBe('changed file content')
    expect(workspace.files['file1'].saved).toBe(true)
  })

  it('should not update file content when file is changed but it is not saved', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/path/to/file1',
          encoding: FileEncodings.UTF8,
          editorContent: 'file content',
          saved: false,
          removed: false,
          title: 'title',
          dir: '/path/to',
          lang: KnownLanguages.MySQL,
        },
      },
      windows: {},
      active: null,
    })

    chokidarWatch.mockImplementationOnce(((_: string | string[], callback: () => any) => {
      callback()
    }) as any)

    fsReadFile.mockResolvedValueOnce('changed file content')

    await workspace.watchFile('file1')

    expect(fsReadFile).toHaveBeenCalled()
    expect(workspace.files['file1'].editorContent).toBe('file content')
    expect(workspace.files['file1'].saved).toBe(false)
  })

  it('should set status removed to true when file is removed', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: '/path/to/file1',
          encoding: FileEncodings.UTF8,
          editorContent: 'file content',
          saved: true,
          removed: false,
          title: 'title',
          dir: '/path/to',
          lang: KnownLanguages.MySQL,
        },
      },
      windows: {},
      active: null,
    })

    const closeWatcher = vi.fn()

    fsPathExists.mockResolvedValue(false)

    chokidarWatch.mockImplementationOnce(((_: string | string[], callback: () => any) => {
      callback()
      return closeWatcher
    }) as any)

    await workspace.watchFile('file1')

    expect(fsPathExists).toHaveBeenCalledWith('/path/to/file1')
    expect(chokidarWatch).toHaveBeenCalledOnce()
    expect(closeWatcher).toHaveBeenCalledOnce()

    expect(workspace.files['file1'].removed).toBe(true)
  })
})
