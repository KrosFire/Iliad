import { Direction, FileEncodings, KnownLanguages, PAGES } from '~/types'
import { StateTree } from 'pinia'

export interface File {
  id: string
  path: string
  title: string
  ext?: string
  dir: string
  lang: KnownLanguages | null
  encoding: FileEncodings
  editorContent: string
  removed: boolean
  saved: boolean
  watcher?: () => void
}

export type FileTab = {
  __typename: 'FileTab'
  id: string
}

export type PageTab = {
  __typename: 'PageTab'
  id: PAGES
}

export type Tab = FileTab | PageTab

export type ContainerWindow = {
  __typename: 'ContainerWindow'
  id: string
  children: string[]
  parent: string | null
  direction: Direction
}

export type TabsWindow = {
  __typename: 'TabsWindow'
  id: string
  tabs: Tab[]
  parent: string | null
  active: number
}

export type Window = ContainerWindow | TabsWindow

export type FileSystemDirectory = {
  __typename: 'FileSystemDirectory'
  path: string
  name: string
  parent: string
  children: FileSystemNode[]
  open: boolean
  rename?: boolean
  create?: 'file' | 'dir'
  watcher?: () => void
}

export type FileSystemFile = {
  __typename: 'FileSystemFile'
  path: string
  name: string
  parent: string
  lang?: KnownLanguages
  isLink: boolean
  rename?: boolean
  linkTarget?: string
}

export type FileSystemNode = FileSystemDirectory | FileSystemFile

export type SelectedFsNode = {
  __typename: FileSystemNode['__typename']
  path: string
  mass: boolean
}

export interface WorkspaceState extends StateTree {
  workspace: string | null
  files: {
    [key: string]: File
  }
  windows: {
    [key: string]: Window
  }
  active: string | null
  fileSystem: FileSystemDirectory | null
  lastSelectedFsNode: string | null
  selectedFsNodes: SelectedFsNode[]
}

export default WorkspaceState
