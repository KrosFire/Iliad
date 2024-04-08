import { emit, listen } from '@/api/event'
import invoke from '@/api/invoke'
import { KnownLanguages } from '~/types'
import uniqueId from 'lodash/uniqueId'
import { NotificationMessage, RequestMessage, ResponseMessage } from 'vscode-languageserver'
import { DocumentUri } from 'vscode-languageserver'
import { URI } from 'vscode-uri'

/**
 * @requires init function to be called before sending requests
 */
class LSP {
  private languageId: string
  private workspacePath: string
  #initialized = false

  #filesVersion: Record<string, number> = {}

  constructor(languageId: KnownLanguages, workspacePath: string) {
    this.languageId = languageId.toLowerCase()
    this.workspacePath = workspacePath
  }

  private async startServer() {
    return new Promise<number>(resolve => {
      listen('lsp_server_started', payload => {
        if (payload.languageId !== this.languageId) {
          return
        }

        resolve(payload.parentProcessId)
      })

      invoke('start_lsp', { languageId: this.languageId })
    })
  }

  public async init() {
    if (this.initialized) {
      throw new Error('LSP already initialized')
    }

    const processId = await this.startServer()

    await this.sendRequest('initialize', {
      processId,
      rootUri: this.encodeUri(this.workspacePath),
      capabilities: {
        workspace: {
          executeCommand: {
            dynamicRegistration: true,
          },
          applyEdit: true,
          workspaceEdit: {
            documentChanges: true,
          },
          didChangeWatchedFiles: {
            relativePatternSupport: true,
            dynamicRegistration: true,
          },
        },
        textDocument: {
          synchronization: {
            dynamicRegistration: true,
            didSave: true,
          },
          definition: {
            dynamicRegistration: true,
            linkSupport: true,
          },
          declaration: {
            dynamicRegistration: true,
            linkSupport: true,
          },
        },
      },
    })

    this.initialized = true

    await this.sendNotification('initialized', {})
  }

  public async documentDidOpen(uri: string, text: string) {
    if (this.filesVersion[uri]) {
      return
    }

    this.filesVersion[uri] = 1

    await this.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: this.languageId,
        version: 1,
        text,
      },
    })
  }

  public async documentDidChange(uri: string, text: string) {
    if (!this.filesVersion[uri]) {
      return await this.documentDidOpen(uri, text)
    }

    DocumentUri

    await this.sendNotification('textDocument/didChange', {
      textDocument: {
        uri,
        version: ++this.filesVersion[uri],
      },
      contentChanges: [
        {
          text,
        },
      ],
    })
  }

  public async documentDidClose(uri: string) {
    if (!this.filesVersion[uri]) {
      return
    }

    await this.sendNotification('textDocument/didClose', {
      textDocument: {
        uri,
      },
    })

    delete this.filesVersion[uri]
  }

  public async goToDeclaration(uri: string, position: { line: number; character: number }) {
    return this.sendRequest('textDocument/declaration', {
      textDocument: {
        uri: this.encodeUri(uri),
      },
      position,
    })
  }

  public async goToDefinition(uri: string, text: string, position: { line: number; character: number }) {
    if (!this.filesVersion[uri]) {
      await this.documentDidOpen(uri, text)
    }

    return this.sendRequest('textDocument/definition', {
      textDocument: {
        uri: this.encodeUri(uri),
      },
      position,
    })
  }

  public async sendNotification(method: string, params?: NotificationMessage['params']) {
    if (!this.initialized) {
      await this.init()
    }

    await emit('lsp_msg_send', {
      languageId: this.languageId,
      message: {
        jsonrpc: '2.0',
        method,
        params,
      },
    })
  }

  public async sendRequest<T extends ResponseMessage['result']>(
    method: string,
    params?: RequestMessage['params'],
  ): Promise<T> {
    if (!this.initialized && method !== 'initialize') {
      await this.init()
    }

    const requestId = this.genRequestId()

    return new Promise((resolve, reject) => {
      const unlistenFnPromise = listen('lsp_msg_received', async payload => {
        if (payload.id !== requestId) {
          return
        }

        if (payload.result) {
          resolve(payload.result as T)
        } else {
          reject(payload.error)
        }

        const unlisten = await unlistenFnPromise

        unlisten()
      })

      emit('lsp_msg_send', {
        languageId: this.languageId,
        message: {
          id: requestId,
          jsonrpc: '2.0',
          method,
          params,
        },
      })
    })
  }

  public encodeUri(uri: string): string {
    return URI.file(uri).toString()
  }

  public decodeUri(uri: string): string {
    return URI.parse(uri).fsPath
  }

  private genRequestId() {
    return uniqueId(this.languageId)
  }

  public get initialized() {
    return this.#initialized
  }

  private set initialized(value) {
    this.#initialized = value
  }

  public get filesVersion() {
    return this.#filesVersion
  }

  public set filesVersion(value) {
    this.#filesVersion = value
  }
}

export default LSP
