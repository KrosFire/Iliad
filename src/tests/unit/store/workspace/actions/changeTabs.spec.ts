import { initWorkspaceState } from '@/tests/helpers/initState'
import { TabsWindow } from '~/types'
import { createPinia, setActivePinia } from 'pinia'

describe('changeTabs action', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Should close empty window', () => {
    const store = initWorkspaceState({
      windows: {
        main: {
          __typename: 'TabsWindow',
          id: '1',
          parent: null,
          tabs: [
            {
              __typename: 'FileTab',
              id: '1',
            },
          ],
          active: 0,
        },
      },
    })

    store.closeWindow = vi.fn()

    store.changeTabs('main', [])

    expect(store.closeWindow).toHaveBeenCalledOnce()
    expect(store.closeWindow).toHaveBeenCalledWith('main')
  })

  it('Should decrease active tab index', () => {
    const store = initWorkspaceState({
      windows: {
        main: {
          __typename: 'TabsWindow',
          id: '1',
          parent: null,
          tabs: [
            {
              __typename: 'FileTab',
              id: '1',
            },
            {
              __typename: 'FileTab',
              id: '2',
            },
          ],
          active: 1,
        },
      },
    })

    store.changeTabs('main', [
      {
        __typename: 'FileTab',
        id: '1',
      },
    ])

    expect((store.windows.main as TabsWindow).active).toBe(0)
  })

  it('Should update tabs list', () => {
    const store = initWorkspaceState({
      windows: {
        main: {
          __typename: 'TabsWindow',
          id: '1',
          parent: null,
          tabs: [
            {
              __typename: 'FileTab',
              id: '1',
            },
          ],
          active: 0,
        },
      },
    })

    store.changeTabs('main', [
      {
        __typename: 'FileTab',
        id: '2',
      },
    ])

    expect((store.windows.main as TabsWindow).tabs).toEqual([
      {
        __typename: 'FileTab',
        id: '2',
      },
    ])
  })
})
