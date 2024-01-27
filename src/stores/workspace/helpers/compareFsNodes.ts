import { FileSystemNode } from '~/types'

/**
 * @returns
 *
 * `1` if `a > b`
 *
 * `-1` if `a < b`
 *
 * `0` if `a === b`
 */
const compareFsNodes = (a: FileSystemNode, b: FileSystemNode) => {
  let aSegments = a.path.replaceAll('\\/', '_').split('/')
  let bSegments = b.path.replaceAll('\\/', '_').split('/')

  const minPath = Math.min(aSegments.length, bSegments.length)

  let i = 0

  while (i < minPath - 1 && aSegments[i] === bSegments[i]) {
    i++
  }

  aSegments = aSegments.slice(i)
  bSegments = bSegments.slice(i)

  const joinedPathA = aSegments.join('/')
  const joinedPathB = bSegments.join('/')

  // If pathA has a folder, but pathB ends in common dir as a file
  if (aSegments.length > 1 && bSegments.length === 1) {
    if (b.__typename === 'FileSystemDirectory') {
      return joinedPathA.localeCompare(joinedPathB)
    }
    return -1
  }

  if (bSegments.length > 1 && aSegments.length === 1) {
    if (a.__typename === 'FileSystemDirectory') {
      return joinedPathA.localeCompare(joinedPathB)
    }
    return 1
  }

  if (aSegments.length === 1 && bSegments.length === 1) {
    if (a.__typename === 'FileSystemDirectory' && b.__typename === 'FileSystemFile') return -1
    if (a.__typename === 'FileSystemFile' && b.__typename === 'FileSystemDirectory') return 1
  }

  return aSegments[0].localeCompare(bSegments[0])
}

export default compareFsNodes
