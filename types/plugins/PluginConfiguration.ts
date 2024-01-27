import { PluginType } from '../store'

export interface PluginIlliadeOptions {
  title: string;
  icon: string;
  description: string;
  author: string;
  keywords: string[];
  repository: string;
  homepage: string;
  marketplace: string;
  type: PluginType;
}

export interface PluginConfiguration {
  main: string;
  version: string;
  illiade: PluginIlliadeOptions;
}