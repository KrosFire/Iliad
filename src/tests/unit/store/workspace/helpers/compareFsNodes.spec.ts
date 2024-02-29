import compareFsNodes from '@/stores/workspace/helpers/compareFsNodes'
import { FileSystemNode } from '~/types'

describe('compareFsNodes helper', () => {
  it('should sort first dirs and then files', () => {
    const paths: FileSystemNode[] = [
      {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir1/dir1',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/dir1/file1',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/.aaa',
      },
    ] as FileSystemNode[]

    const randomSortedPaths = [...paths].sort(() => (Math.random() < 0.5 ? -1 : 1))

    const sortedPaths = randomSortedPaths.sort(compareFsNodes)

    expect(sortedPaths).toEqual(paths)
  })

  it('should sort paths in the right order', () => {
    const paths: FileSystemNode[] = [
      {
        __typename: 'FileSystemDirectory',
        path: '/',
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir1',
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir1/dir1',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/dir1/file1',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/dir1/file2',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir1/.aaa',
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir2',
      },
      {
        __typename: 'FileSystemDirectory',
        path: '/dir2/dir1',
      },
      {
        __typename: 'FileSystemFile',
        path: '/dir2/file1',
      },
      {
        __typename: 'FileSystemFile',
        path: '/aaaa',
      },
    ] as FileSystemNode[]

    const pathsCopy = [...paths]

    for (let i = 0; i < 100; i++) {
      const randomSortedPaths = pathsCopy.sort(() => (Math.random() < 0.5 ? -1 : 1))

      const sortedPaths = randomSortedPaths.sort(compareFsNodes)

      expect(sortedPaths).toEqual(paths)
    }
  })
})
