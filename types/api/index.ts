import { NotificationMessage, RequestMessage, ResponseMessage } from 'vscode-languageserver'

import { FileEncodings, KnownLanguages } from '..'
import { GlobalStore } from '../editorStore/global'
import { SettingsStore } from '../editorStore/settings'
import { WorkspaceStore } from '../editorStore/workspace'

export type StoreName = 'global' | 'workspace' | 'settings'

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
      newName: string
    }
    return: void
  }

  path_exists: {
    arguments: {
      path: string
    }
    return: boolean
  }

  create_window: {
    arguments: {
      path: string
    }
    return: void
  }

  close_window: {
    return: void
  }

  get_state:
    | {
        arguments: {
          storeType: 'global'
        }
        return: GlobalStore
      }
    | {
        arguments: {
          storeType: 'workspace'
        }
        return: WorkspaceStore
      }
    | {
        arguments: {
          storeType: 'settings'
        }
        return: SettingsStore
      }

  update_state: {
    arguments: {
      storeType: StoreName
      newState: string
    }
    return: void
  }

  start_lsp: {
    arguments: {
      languageId: KnownLanguages
    }
    return: void
  }
}

export interface Events {
  lsp_server_started: {
    payload: {
      languageId: string
      parentProcessId: number
    }
  }

  lsp_msg_send: {
    payload: {
      languageId: string
      message: RequestMessage | NotificationMessage
    }
  }

  lsp_msg_received: {
    payload: ResponseMessage
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
