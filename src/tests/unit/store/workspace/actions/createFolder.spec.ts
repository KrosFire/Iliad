vi.mock('@/api/mkdir', () => ({
  default: vi.fn(),
}))

vi.mock('@tauri-apps/api/path', () => ({
  dirname: vi.fn((path: string) => path.split('/').slice(0, -1).join('/') || '/'),
}))

import mkdir from '@/api/mkdir'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { WorkspaceState } from '~/types'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('createFolder action', () => {
  const mkdirMock = mkdir as MockedFunction<typeof mkdir>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('Should call fs.mkdir', async () => {
    const store = initWorkspaceState()

    await store.createFolder('dir1')

    expect(mkdirMock).toHaveBeenCalledTimes(1)
    expect(mkdirMock).toHaveBeenCalledWith('dir1')
  })

  it('Should disable folder creation in a given dir', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        create: 'dir',
      },
    } as WorkspaceState)

    await store.createFolder('/dir1')

    expect(store.fileSystem?.create).toBeUndefined()
  })
})
