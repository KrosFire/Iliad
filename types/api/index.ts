import { FileEncodings } from '..'

export interface Commands {
  read_dir: {
    arguments: {
      path: string
    }
    return: ReadDirItem[]
  }

  read_file: {
    arguments: {
      path: string
      encoding: FileEncodings
    }
    return: string
  }

  read_link: {
    arguments: {
      path: string
    }
    return: string
  }

  create_file: {
    arguments: {
      path: string
    }
    return: void
  }

  mkdir: {
    arguments: {
      path: string
    }
    return: void
  }

  file_info: {
    arguments: {
      path: string
    }
    return: FileInfo
  }

  remove_file: {
    arguments: {
      path: string
    }
    return: void
  }

  remove_dir: {
    arguments: {
      path: string
      recursive: boolean
    }
    return: void
  }

  write_file: {
    arguments: {
      path: string
      contents: string
      encoding: FileEncodings
    }
    return: void
  }

  rename: {
    arguments: {
      path: string
      new_name: string
    }
    return: void
  }

  path_exists: {
    arguments: {
      path: string
    }
    return: boolean
  }
}

export interface ReadDirItem {
  path: string
  name: string
  is_dir: boolean
  is_file: boolean
  is_symlink: boolean
}

export interface FileInfo {
  path: string
  name: string
  is_dir: boolean
  is_file: boolean
  is_symlink: boolean
  size: number
  accessed: number
  modified: number
  created: number
}
