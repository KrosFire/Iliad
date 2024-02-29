import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('closeDirectory action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Removes directory', async () => {
    const watcherMock = vi.fn()

    const workspace = initWorkspaceState({
      fileSystem: {
        __typename: 'FileSystemDirectory',
        path: '/',
        name: '',
        parent: '',
        open: true,
        watcher: watcherMock as any,
        children: [
          {
            __typename: 'FileSystemDirectory',
            path: '/dir1',
            name: '',
            parent: '',
            open: true,
            watcher: watcherMock as any,
            children: [
              {
                __typename: 'FileSystemDirectory',
                path: '/dir1/dir2',
                name: '',
                parent: '',
                open: true,
                watcher: watcherMock as any,
                children: [
                  {
                    __typename: 'FileSystemDirectory',
                    path: '/dir1/dir2/dir3',
                    name: '',
                    parent: '',
                    open: true,
                    watcher: watcherMock as any,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    await workspace.closeDirectory('/dir1')

    expect(workspace.fileSystem).toEqual({
      __typename: 'FileSystemDirectory',
      path: '/',
      name: '',
      parent: '',
      open: true,
      watcher: watcherMock,
      children: [
        {
          __typename: 'FileSystemDirectory',
          path: '/dir1',
          name: '',
          parent: '',
          open: false,
          watcher: watcherMock,
          children: [
            {
              __typename: 'FileSystemDirectory',
              path: '/dir1/dir2',
              name: '',
              parent: '',
              open: false,
              watcher: watcherMock,
              children: [
                {
                  __typename: 'FileSystemDirectory',
                  path: '/dir1/dir2/dir3',
                  name: '',
                  parent: '',
                  open: false,
                  watcher: watcherMock,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    })

    expect(watcherMock).toHaveBeenCalledTimes(3)
  })
})
