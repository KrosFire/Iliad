vi.mock('@/api/createFile', () => ({
  default: vi.fn(),
}))

vi.mock('@tauri-apps/api/path', () => ({
  dirname: vi.fn(async (path: string) => path.split('/').slice(0, -1).join('/') || '/'),
}))

import createFile from '@/api/createFile'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { WorkspaceState } from '~/types'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('createFile action', () => {
  const openMock = createFile as MockedFunction<typeof createFile>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('Should call fs.open', async () => {
    const store = initWorkspaceState()

    await store.createFile('file1')

    expect(openMock).toHaveBeenCalledTimes(1)
    expect(openMock).toHaveBeenCalledWith('file1')
  })

  it('Should disable file creation in a given dir', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        create: 'file',
      },
    } as WorkspaceState)

    await store.createFile('/file1')

    expect(store.fileSystem?.create).toBeUndefined()
  })
})
