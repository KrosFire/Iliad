import createWindow from '@/api/createWindow'
import { writeText } from '@tauri-apps/api/clipboard'
import { open } from '@tauri-apps/api/shell'
import { FileSystemDirectory, WorkspaceStore } from '~/types'
import { ContextMenu } from 'tauri-plugin-context-menu'

const getContextMenu = (folder: FileSystemDirectory, workspaceStore: WorkspaceStore): ContextMenu.Options => ({
  items: [
    {
      label: 'New File',
      event: () => {
        workspaceStore.startFsNodeCreation(folder.path, 'file')
      },
    },
    {
      label: 'New Folder',
      event: () => {
        workspaceStore.startFsNodeCreation(folder.path, 'dir')
      },
    },
    {
      label: 'Reveal in Finder',
      event: () => {
        open(folder.path)
      },
    },
    {
      is_separator: true,
    },
    {
      label: 'Open as Workspace',
      event: () => {
        createWindow(folder.path)
      },
    },
    {
      is_separator: true,
    },
    {
      label: 'Copy path',
      event: () => {
        writeText(folder.path)
      },
    },
    {
      is_separator: true,
    },
    {
      label: 'Rename',
      event: () => {
        workspaceStore.startRenameFsNode(folder.path)
      },
    },
    {
      label: 'Delete',
      event: () => {
        workspaceStore.deleteFsNode(folder.path)
      },
    },
  ],
})

export default getContextMenu
