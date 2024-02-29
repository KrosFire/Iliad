import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'

describe('updateeditorContent action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  test('If action sets correct tab as active', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: './path/to/file1',
          editorContent: 'editor content',
          fileContent: 'editor content',
          encoding: 'utf-8',
        } as any,
      },
      windows: {},
      active: 'win1',
    })

    await workspace.updateEditorContent('file1', 'new content')

    expect(workspace.files['file1'].editorContent).toEqual('new content')
  })
})
