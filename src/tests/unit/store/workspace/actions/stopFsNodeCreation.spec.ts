import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('stopFsNodeCreation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should unset create flag', async () => {
    const workspace = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        parent: '/',
        name: 'root',
        path: '/',
        open: true,
        children: [
          {
            __typename: 'FileSystemFile',
            parent: '/',
            name: 'file',
            path: '/file',
            isLink: false,
          },
        ],
      },
    })

    await workspace.stopFsNodeCreation('/')

    expect(workspace.fileSystem!.create).toBe(undefined)
  })
})
