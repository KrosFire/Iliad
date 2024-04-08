import { KnownLanguages } from '~/types'
import { Location } from 'vscode-languageserver'

import LSP from './lsp'

const workspacePath = window.__TAURI_METADATA__.__currentWindow.label

class TypescriptLsp extends LSP {
  constructor() {
    super(KnownLanguages.Typescript, workspacePath)
  }

  public async goToDefinition(
    uri: string,
    text: string,
    position: { line: number; character: number },
  ): Promise<Location[] | null> {
    if (!this.filesVersion[uri]) {
      await this.documentDidOpen(uri, text)
    }

    return this.sendRequest('workspace/executeCommand', {
      command: '_typescript.goToSourceDefinition',
      arguments: [this.encodeUri(uri), position],
    })
  }
}

const typescriptLsp = new TypescriptLsp()

export default typescriptLsp
