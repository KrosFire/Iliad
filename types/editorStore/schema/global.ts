import { Schema } from 'electron-store'
import os from 'os'

import { GlobalStore } from '../global'

const globalSchema: Schema<GlobalStore> = {
  lastWorkspacePath: {
    type: 'array',
    items: {
      type: 'string'
    },
    default: [os.homedir()]
  }
}


export default globalSchema
