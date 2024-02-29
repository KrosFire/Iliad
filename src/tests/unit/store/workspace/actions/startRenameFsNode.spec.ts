import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('startRenameFsNode action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should start renaming file', async () => {
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

    await workspace.startRenameFsNode('/file')

    expect(workspace.getFsNode('/file')?.rename).toBe(true)
  })
})
