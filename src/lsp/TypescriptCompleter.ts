import { Ace } from 'ace-builds'
import { CompletionItemKind, CompletionItemTag, InsertTextFormat } from 'vscode-languageserver'

import AceLspCompleter from './AceLspCompleter'
import { TypescriptLsp } from './typescriptLsp'

const completionKindMap = Object.fromEntries(Object.entries(CompletionItemKind).map(([key, value]) => [value, key]))

export default class TypescriptCompleter extends AceLspCompleter {
  id = 'typescriptCompleter'
  lsp: TypescriptLsp
  filePath: string

  constructor(lsp: TypescriptLsp, filePath: string) {
    super()

    this.lsp = lsp
    this.filePath = filePath
    this.triggerCharacters = lsp.autocompleteTriggerCharacters
  }

  public async getCompletions(
    editor: Ace.Editor,
    _session: Ace.EditSession,
    pos: Ace.Position,
    prefix: string,
    callback: Ace.CompleterCallback,
  ) {
    const completions = await this.lsp.getCompletions(this.filePath, editor.getValue(), {
      line: pos.row,
      character: pos.column,
    })

    const completionsList: Ace.Completion[] =
      completions?.items
        .filter(item => !item.tags?.some(tag => tag === CompletionItemTag.Deprecated))
        .filter(item => (item.textEdit?.newText || item.insertText || item.label).startsWith(prefix))
        .slice(0, 10)
        .map(item => {
          const text = item.textEdit?.newText ?? item.insertText ?? item.label

          const range = item.textEdit ? this.getTextEditRange(item.textEdit) : undefined

          const completion = {
            caption: item.label,
            meta: item.kind && completionKindMap[item.kind],
            range,
          } as Ace.BaseCompletion

          if (item.insertTextFormat == InsertTextFormat.Snippet) {
            ;(completion as Ace.SnippetCompletion)['snippet'] = text
          } else {
            ;(completion as Ace.ValueCompletion)['value'] = text
          }

          return completion as Ace.Completion
        }) || []

    callback(null, completionsList)
  }
}
