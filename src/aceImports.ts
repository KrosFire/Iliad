import { resolveResource } from '@tauri-apps/api/path'
import { FileEncodings } from '~/types'
import ace from 'ace-builds'

import readFile from './api/readFile'

const loadedResources = new Set<string>()

export const resolveAceResource = async (
  resourceName: string,
  type: 'ext' | 'keybinding' | 'mode' | 'theme' | 'worker',
): Promise<any> => {
  const standardizedResourceName = resourceName.toLocaleLowerCase()

  const moduleName = `ace/${type}/${standardizedResourceName}`

  if (loadedResources.has(moduleName)) {
    return ace.require(moduleName)
  }

  const resourceFileName = `${type}-${standardizedResourceName}.js`

  const path = await resolveResource(`../node_modules/ace-builds/src-min-noconflict/${resourceFileName}`)

  const file = await readFile(path, FileEncodings.UTF8)

  const fileBlob = new Blob([file], { type: 'application/javascript' })

  const fileUrl = URL.createObjectURL(fileBlob)

  ace.config.setModuleUrl(moduleName, fileUrl)

  return new Promise(resolve => {
    ace.config.loadModule(moduleName, module => {
      loadedResources.add(moduleName)

      resolve(module)
    })
  })
}
