import { PLUGIN_TYPES } from '../store'

export interface PluginIliadOptions {
  title: string
  icon: string
  description: string
  author: string
  keywords: string[]
  repository: string
  homepage: string
  marketplace: string
  type: PLUGIN_TYPES
}

export interface PluginConfiguration {
  main: string
  version: string
  iliad: PluginIliadOptions
}
