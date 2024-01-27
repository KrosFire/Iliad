export interface Queries {
  read_dir: {
    arguments: {
      path: string
    }
    return: ReadDirItem[]
  }
}

export interface ReadDirItem {
  path: string
  name: string
  is_dir: boolean
  is_file: boolean
  is_symlink: boolean
}
