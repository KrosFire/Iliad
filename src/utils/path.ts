import { sep } from '@tauri-apps/api/path'

export type ParsedPath = {
  root: string
  dir: string
  base: string
  ext: string | null
  name: string
}

export const parse = (filePath: string): ParsedPath => {
  const segments = filePath.split(sep)

  const root = sep + segments[0]
  const base = segments[segments.length - 1]
  const lastExtIndex = base.lastIndexOf('.')

  const ext = lastExtIndex === -1 ? null : base.slice(lastExtIndex + 1)
  const name = lastExtIndex === -1 ? base : base.slice(0, lastExtIndex)

  const dir = segments.slice(0, segments.length - 1).join(sep)

  return {
    root,
    dir,
    base,
    ext,
    name,
  }
}
