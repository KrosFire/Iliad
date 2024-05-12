import { initWorkspaceState } from '@/tests/helpers/initState'
import { FileEncodings, KnownLanguages } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('initState action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should map all primitive values of worskpace store', async () => {
    const workspace = initWorkspaceState()

    workspace.openFile = vi.fn()

    await workspace.initState({
      active: 'abcd1234',
      workspace: 'abcd1234',
      files: {
        test: {
          path: '/dir1/test',
          encoding: FileEncodings.UTF8,
          editorContent: 'editor content',
          id: 'test',
          title: 'test title',
          dir: '/dir1',
          lang: KnownLanguages.Java,
          removed: false,
          saved: true,
        },
      },
      windows: {
        abcd1234: {
          __typename: 'TabsWindow',
          id: 'abcd1234',
          parent: null,
          tabs: [
            {
              __typename: 'FileTab',
              id: 'test',
            },
          ],
          active: 0,
        },
      },
      selectedFsNodes: [],
      lastSelectedFsNode: null,
      fileSystem: null,
    })

    expect(workspace.active).toBe('abcd1234')
    expect(workspace.workspace).toBe('abcd1234')
    expect(workspace.selectedFsNodes).toEqual([])
    expect(workspace.lastSelectedFsNode).toBe(null)
    expect(workspace.fileSystem).toBe(null)
    expect(workspace.windows).toEqual({
      abcd1234: {
        __typename: 'TabsWindow',
        id: 'abcd1234',
        parent: null,
        tabs: [
          {
            __typename: 'FileTab',
            id: 'test',
          },
        ],
        active: 0,
      },
    })
  })

  it('should open all opened files', async () => {
    const workspace = initWorkspaceState()

    workspace.openFile = vi.fn()

    await workspace.initState({
      active: 'abcd1234',
      workspace: 'abcd1234',
      files: {
        test: {
          path: '/dir1/test',
          encoding: FileEncodings.UTF8,
          editorContent: 'editor content',
          id: 'test',
          title: 'test title',
          dir: '/dir1',
          lang: KnownLanguages.Java,
          removed: false,
          saved: true,
        },
        test2: {
          path: '/dir1/test2',
          encoding: FileEncodings.UTF8,
          editorContent: 'another editor content',
          id: 'test2',
          title: 'test title',
          dir: '/dir1',
          lang: KnownLanguages.Java,
          removed: false,
          saved: true,
        },
      },
      windows: {},
      selectedFsNodes: [],
      lastSelectedFsNode: null,
      fileSystem: null,
    })

    expect(workspace.files).toMatchObject({
      test: {
        path: '/dir1/test',
        encoding: FileEncodings.UTF8,
        editorContent: 'editor content',
        id: 'test',
        title: 'test title',
        dir: '/dir1',
        lang: KnownLanguages.Java,
        removed: false,
        saved: true,
      },
      test2: {
        path: '/dir1/test2',
        encoding: FileEncodings.UTF8,
        editorContent: 'another editor content',
        id: 'test2',
        title: 'test title',
        dir: '/dir1',
        lang: KnownLanguages.Java,
        removed: false,
        saved: true,
      },
    })

    expect(workspace.openFile).toHaveBeenCalledTimes(2)
    expect(workspace.openFile).toHaveBeenCalledWith('/dir1/test', FileEncodings.UTF8)
    expect(workspace.openFile).toHaveBeenCalledWith('/dir1/test', FileEncodings.UTF8)
  })

  it('should open all opened directories', async () => {
    const workspace = initWorkspaceState()

    workspace.openDirectory = vi.fn()

    await workspace.initState({
      active: 'abcd1234',
      workspace: 'abcd1234',
      files: {},
      windows: {},
      selectedFsNodes: [],
      lastSelectedFsNode: null,
      fileSystem: {
        path: '/dir1',
        name: 'dir1',
        open: true,
        parent: '/',
        openedChildren: [
          {
            path: '/dir1/dir2',
            name: 'dir2',
            parent: '/dir1',
            open: true,
            openedChildren: [
              {
                path: '/dir1/dir2/dir3',
                name: 'dir3',
                parent: '/dir1/dir2',
                open: false,
                openedChildren: [],
              },
            ],
          },
        ],
      },
    })

    expect(workspace.openDirectory).toHaveBeenCalledTimes(2)
    expect(workspace.openDirectory).toHaveBeenCalledWith('/dir1')
    expect(workspace.openDirectory).toHaveBeenCalledWith('/dir1/dir2')
  })
})
