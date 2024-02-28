import { writeText } from '@tauri-apps/api/clipboard'
import { open } from '@tauri-apps/api/shell'
import { FileSystemFile, WorkspaceStore } from '~/types'
import { ContextMenu } from 'tauri-plugin-context-menu'

const getContextMenu = (file: FileSystemFile, workspaceStore: WorkspaceStore): ContextMenu.Options => ({
  items: [
    {
      label: 'Open',
      event: () => {
        workspaceStore.openFile(file.path)
      },
    },
    {
      label: 'Reveal in Finder',
      event: () => {
        open(file.parent)
      },
    },
    {
      is_separator: true,
    },
    {
      label: 'Copy path',
      event: () => {
        writeText(file.path)
      },
    },
    {
      is_separator: true,
    },
    {
      label: 'Rename',
      event: () => {
        workspaceStore.startRenameFsNode(file.path)
      },
    },
    {
      label: 'Delete',
      event: () => {
        workspaceStore.deleteFsNode(file.path)
      },
    },
  ],
})

export default getContextMenu
