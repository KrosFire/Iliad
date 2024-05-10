import { Ace, Range } from 'ace-builds'
import { HoverTooltip } from 'ace-tooltip'
import highlight from 'highlight.js'
import showdown from 'showdown'
import { CompletionItemKind, CompletionItemTag, InsertTextFormat } from 'vscode-languageserver'

import AceLspCompleter from './AceLspCompleter'
import { TypescriptLsp } from './typescriptLsp'

const completionKindMap = Object.fromEntries(Object.entries(CompletionItemKind).map(([key, value]) => [value, key]))

export default class TypescriptCompleter extends AceLspCompleter {
  id = 'typescriptCompleter'
  lsp: TypescriptLsp
  filePath: string
  markdownConverter: showdown.Converter
  hoverNode: HTMLDivElement
  hoverTooltip: HoverTooltip

  constructor(lsp: TypescriptLsp, filePath: string, hoverTooltip: HoverTooltip) {
    super()

    this.lsp = lsp
    this.filePath = filePath
    this.triggerCharacters = lsp.autocompleteTriggerCharacters
    this.markdownConverter = new showdown.Converter()
    this.hoverNode = document.createElement('div')
    this.hoverTooltip = hoverTooltip

    this.hoverNode.addEventListener('DOMSubtreeModified', () => {
      this.hoverNode.querySelectorAll('pre code').forEach(el => {
        highlight.highlightElement(el as HTMLElement)

        el.classList.add('p-2')
        el.classList.add('rounded')
        el.classList.add('text-sm')
      })
    })

    this.hoverTooltip.setDataProvider(this.hoverDataProvider.bind(this))
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

  public async hoverDataProvider(e: MouseEvent & { getDocumentPosition: () => Ace.Position }, editor: Ace.Editor) {
    const session = editor.session
    const docPos = e.getDocumentPosition()

    const hoverMsg = await this.lsp.getHover(this.filePath, session.getValue(), {
      line: docPos.row,
      character: docPos.column,
    })

    if (!hoverMsg || !hoverMsg.contents.value) {
      return
    }

    let msg = hoverMsg.contents.value

    if (hoverMsg.contents.kind === 'markdown') {
      msg = this.markdownConverter.makeHtml(msg)
    }

    this.hoverNode.innerHTML = msg

    let range = session.getWordRange(docPos.row, docPos.column)

    if (hoverMsg.range) {
      range = Range.fromPoints(
        {
          row: hoverMsg.range.start.line,
          column: hoverMsg.range.start.character,
        },
        {
          row: hoverMsg.range.end.line,
          column: hoverMsg.range.end.character,
        },
      )
    }

    this.hoverTooltip.showForRange(editor, range, this.hoverNode, e)
  }
}
