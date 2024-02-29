import { initWorkspaceState } from '@/tests/helpers/initState'
import { ContainerWindow, Direction, DropZone, TabsWindow } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('openFilesInWindow action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should open files in an empty workspace', async () => {
    const store = initWorkspaceState()

    store.openFile = vi.fn(async () => 'fileId')

    await store.openFilesInWindow(['file1', 'file2'])

    expect(store.workspace).not.toBeNull()

    const window = store.windows[store.workspace!] as TabsWindow
    expect(window.__typename).toBe('TabsWindow')
    expect(window.tabs.length).toBe(2)
    expect(store.openFile).toHaveBeenCalledTimes(2)
  })

  it('should open files at the end of tabs window', async () => {
    const store = initWorkspaceState()

    let i = 0

    store.openFile = vi.fn(async () => {
      i++
      return `file${i}`
    })

    await store.openFilesInWindow(['file1', 'file2'])
    await store.openFilesInWindow(['file3', 'file4'], store.workspace!)

    const window = store.windows[store.workspace!] as TabsWindow
    expect(window.__typename).toBe('TabsWindow')
    expect(window.tabs.length).toBe(4)
    expect(store.openFile).toHaveBeenCalledTimes(4)
    expect(window.tabs).toEqual([
      { __typename: 'FileTab', id: 'file1' },
      { __typename: 'FileTab', id: 'file2' },
      { __typename: 'FileTab', id: 'file3' },
      { __typename: 'FileTab', id: 'file4' },
    ])
  })

  it('should open files at the beginning of tabs window', async () => {
    const store = initWorkspaceState()

    let i = 0

    store.openFile = vi.fn(async () => {
      i++
      return `file${i}`
    })

    await store.openFilesInWindow(['file1', 'file2'])
    await store.openFilesInWindow(['file3', 'file4'], store.workspace!, DropZone.CENTER, 0)

    const window = store.windows[store.workspace!] as TabsWindow
    expect(window.__typename).toBe('TabsWindow')
    expect(window.tabs.length).toBe(4)
    expect(store.openFile).toHaveBeenCalledTimes(4)
    expect(window.tabs).toEqual([
      { __typename: 'FileTab', id: 'file3' },
      { __typename: 'FileTab', id: 'file4' },
      { __typename: 'FileTab', id: 'file1' },
      { __typename: 'FileTab', id: 'file2' },
    ])
  })

  it('should set active tab to the last opened file', async () => {
    const store = initWorkspaceState()

    store.openFile = vi.fn(async () => 'fileId')

    await store.openFilesInWindow(['file1', 'file2'])
    await store.openFilesInWindow(['file3', 'file4'], store.workspace!)

    const window = store.windows[store.workspace!] as TabsWindow
    expect(window.active).toBe(3)

    await store.openFilesInWindow(['file5', 'file6'], store.workspace!, DropZone.CENTER, 0)
    expect(window.active).toBe(1)
  })

  it('should set active window to the window where files were opened', async () => {
    const store = initWorkspaceState()

    store.openFile = vi.fn(async () => 'fileId')

    await store.openFilesInWindow(['file1', 'file2'])
    await store.openFilesInWindow(['file3', 'file4'], store.workspace!)

    expect(store.active).toBe(store.workspace)

    await store.openFilesInWindow(['file5', 'file6'], store.workspace!, DropZone.LEFT, 0)
    const containerWindow = store.windows[store.workspace!] as ContainerWindow
    expect(containerWindow.__typename).toBe('ContainerWindow')
    expect(store.active).toBe(containerWindow.children[0])
  })

  it('should open files in left most tabs window', async () => {
    const store = initWorkspaceState({
      windows: {
        workspace: {
          __typename: 'ContainerWindow',
          id: 'workspace',
          direction: Direction.HORIZONTAL,
          children: ['window1', 'window2'],
          parent: null,
        },
        window1: {
          __typename: 'TabsWindow',
          id: 'window1',
          tabs: [{ __typename: 'FileTab', id: 'file1' }],
          parent: 'workspace',
          active: 0,
        },
        window2: {
          __typename: 'TabsWindow',
          id: 'window2',
          tabs: [{ __typename: 'FileTab', id: 'file2' }],
          parent: 'workspace',
          active: 0,
        },
      },
      workspace: 'workspace',
    })

    let i = 2

    store.openFile = vi.fn(async () => {
      i++
      return `file${i}`
    })

    await store.openFilesInWindow(['file3', 'file4'])

    const window = store.windows['window1'] as TabsWindow

    expect(window.tabs).toEqual([
      { __typename: 'FileTab', id: 'file1' },
      { __typename: 'FileTab', id: 'file3' },
      { __typename: 'FileTab', id: 'file4' },
    ])
    expect(store.openFile).toHaveBeenCalledTimes(2)
  })

  it('should open files at different positions', async () => {
    const store = initWorkspaceState()

    let i = 0

    store.openFile = vi.fn(async () => {
      i++
      return `file${i}`
    })

    await store.openFilesInWindow(['file1', 'file2'])
    await store.openFilesInWindow(['file3', 'file4'], undefined, DropZone.CENTER, 0)
    await store.openFilesInWindow(['file5', 'file6'], undefined, DropZone.LEFT, 0)
    await store.openFilesInWindow(['file7', 'file8'], undefined, DropZone.RIGHT, 0)
    await store.openFilesInWindow(['file9', 'file10'], undefined, DropZone.TOP, 0)
    await store.openFilesInWindow(['file11', 'file12'], undefined, DropZone.BOTTOM, 0)

    const window = store.windows[store.workspace!] as ContainerWindow
    expect(window.__typename).toBe('ContainerWindow')
    expect(window.children.length).toBe(3)
    expect(window.direction).toBe(Direction.HORIZONTAL)

    const rightContainer = store.windows[window.children[1]] as ContainerWindow
    expect(rightContainer.__typename).toBe('ContainerWindow')
    expect(rightContainer.children.length).toBe(3)
    expect(rightContainer.direction).toBe(Direction.VERTICAL)

    expect(store.active).toEqual(rightContainer.children[1])

    // Check if files are in windows
    const leftWindow = store.windows[window.children[0]] as TabsWindow
    expect(leftWindow.__typename).toBe('TabsWindow')
    expect(leftWindow.tabs.length).toBe(2)
    expect(leftWindow.tabs).toEqual([
      { __typename: 'FileTab', id: 'file5' },
      { __typename: 'FileTab', id: 'file6' },
    ])

    const rightWindow = store.windows[window.children[2]] as TabsWindow
    expect(rightWindow.__typename).toBe('TabsWindow')
    expect(rightWindow.tabs.length).toBe(4)
    expect(rightWindow.tabs).toEqual([
      { __typename: 'FileTab', id: 'file3' },
      { __typename: 'FileTab', id: 'file4' },
      { __typename: 'FileTab', id: 'file1' },
      { __typename: 'FileTab', id: 'file2' },
    ])

    const topWindow = store.windows[rightContainer.children[0]] as TabsWindow

    expect(topWindow.__typename).toBe('TabsWindow')
    expect(topWindow.tabs.length).toBe(2)
    expect(topWindow.tabs).toEqual([
      { __typename: 'FileTab', id: 'file9' },
      { __typename: 'FileTab', id: 'file10' },
    ])

    const centerWindow = store.windows[rightContainer.children[1]] as TabsWindow

    expect(centerWindow.__typename).toBe('TabsWindow')
    expect(centerWindow.tabs.length).toBe(2)
    expect(centerWindow.tabs).toEqual([
      { __typename: 'FileTab', id: 'file11' },
      { __typename: 'FileTab', id: 'file12' },
    ])

    const bottomWindow = store.windows[rightContainer.children[2]] as TabsWindow

    expect(bottomWindow.__typename).toBe('TabsWindow')
    expect(bottomWindow.tabs.length).toBe(2)
    expect(bottomWindow.tabs).toEqual([
      { __typename: 'FileTab', id: 'file7' },
      { __typename: 'FileTab', id: 'file8' },
    ])
  })
})
