vi.mock('@/api/readFile', () => ({
  default: vi.fn((): string => 'file content'),
}))

vi.mock('@tauri-apps/api/path', () => ({
  sep: '/',
}))

vi.mock('tauri-plugin-fs-watch-api', () => ({
  watch: vi.fn(),
}))

import { initWorkspaceState } from '@/tests/helpers/initState'
import { FileEncodings } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('openFile action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Should open new file', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {} as any,
      },
      windows: {
        win1: {
          __typename: 'TabsWindow',
          id: 'win1',
          tabs: [{ __typename: 'FileTab', id: 'file1' }],
          active: 0,
          parent: null,
        },
      },
    })

    const id = await workspace.openFile('fileDir/file2.js', FileEncodings.UTF8)

    expect(id.length).toBeGreaterThan(0)
    expect(workspace.files).toMatchObject({
      file1: {},
      [id]: {
        id,
        title: 'file2',
        dir: 'fileDir',
        path: 'fileDir/file2.js',
        lang: 'JavaScript',
        encoding: FileEncodings.UTF8,
        editorContent: 'file content',
        removed: false,
        saved: true,
      },
    })
  })

  it('Should call watchFile action', async () => {
    const workspace = initWorkspaceState()

    const watchFile = vi.spyOn(workspace, 'watchFile')

    await workspace.openFile('file1.js', FileEncodings.UTF8)

    expect(watchFile).toBeCalledTimes(1)
  })

  it('Should open already existing file', async () => {
    const workspace = initWorkspaceState()

    const id = await workspace.openFile('file1.js', FileEncodings.UTF8)

    expect(id.length).toBeGreaterThan(0)
    expect(workspace.files).toMatchObject({
      [id]: {
        id,
        dir: '',
        editorContent: 'file content',
        encoding: FileEncodings.UTF8,
        lang: 'JavaScript',
        path: 'file1.js',
        removed: false,
        saved: true,
        title: 'file1',
      },
    })

    const secondId = await workspace.openFile('file1.js', FileEncodings.UTF8)

    expect(secondId).toEqual(id)
  })
})
