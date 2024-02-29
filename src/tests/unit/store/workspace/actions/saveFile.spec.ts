vi.mock('@/api/writeFile', () => ({
  default: vi.fn(),
}))

import writeFileFn from '@/api/writeFile'
import { initWorkspaceState } from '@/tests/helpers/initState'
import { createPinia, setActivePinia } from 'pinia'
import { MockedFunction } from 'vitest'

describe('saveFile action', () => {
  const writeFile = writeFileFn as MockedFunction<typeof writeFileFn>

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  test('If file is being saved correctly', async () => {
    const workspace = initWorkspaceState({
      files: {
        file1: {
          id: 'file1',
          path: './path/to/file1',
          editorContent: 'editor content',
          encoding: 'utf-8',
        } as any,
      },
      windows: {},
      active: '',
    })

    await workspace.saveFile('file1')

    expect(writeFile).toHaveBeenCalledOnce()
    expect(writeFile.mock.calls[0].slice(0, 3)).toEqual(['./path/to/file1', 'editor content', 'utf-8'])
  })
})
