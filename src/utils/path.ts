import { path } from '@tauri-apps/api'

export type ParsedPath = {
  root: string
  dir: string
  base: string
  ext: string
  name: string
}

export const parse = (filePath: string): ParsedPath => {
  const segments = filePath.split(path.sep)

  const root = path.sep + segments[0]
  const base = segments[segments.length - 1]
  const [name, ext] = base.split('.')
  const dir = segments.slice(0, segments.length - 1).join(path.sep)

  return {
    root,
    dir,
    base,
    ext,
    name,
  }
}
