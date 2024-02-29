import { initWorkspaceState } from '@/tests/helpers/initState'
import { WorkspaceState } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('startFsNodeCreation action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('Should set create property on a directory', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        create: 'dir',
      },
    } as WorkspaceState)

    await store.startFsNodeCreation('/', 'dir')

    expect(store.fileSystem?.create).toBe('dir')
  })

  it('Should set create property on a file', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        create: 'dir',
      },
    } as WorkspaceState)

    await store.startFsNodeCreation('/', 'file')

    expect(store.fileSystem?.create).toBe('file')
  })

  it('Should open closed directory', async () => {
    const store = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        create: 'dir',
        open: false,
      },
    } as WorkspaceState)

    store.openDirectory = vi.fn()

    await store.startFsNodeCreation('/', 'dir')

    expect(store.openDirectory).toHaveBeenCalledTimes(1)
    expect(store.openDirectory).toHaveBeenCalledWith('/')
  })
})
