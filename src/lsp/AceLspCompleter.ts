import ace, { Ace } from 'ace-builds'
import { InsertReplaceEdit, TextEdit } from 'vscode-languageserver'

export default abstract class AceLspCompleter implements Ace.Completer {
  identifierRegexps?: Array<RegExp>
  getDocTooltip?(item: Ace.Completion): undefined | string | Ace.Completion
  onSeen?: (editor: Ace.Editor, completion: Ace.Completion) => void
  onInsert?: (editor: Ace.Editor, completion: Ace.Completion) => void
  cancel?(): void
  id?: string
  triggerCharacters?: string[]
  hideInlinePreview?: boolean

  abstract getCompletions(
    editor: Ace.Editor,
    session: Ace.EditSession,
    pos: Ace.Position,
    prefix: string,
    callback: Ace.CompleterCallback,
  ): Promise<void> | void

  abstract hoverDataProvider(
    e: MouseEvent & { getDocumentPosition: () => Ace.Position },
    editor: Ace.Editor,
  ): Promise<void> | void

  /**
   * Merge ranges.
   * Ranges are merged if they overlap or are adjacent.
   *
   * Implementation based on Ace linters:
   * https://github.com/mkslanc/ace-linters/blob/f52b8392f7ecc3df526f52e9d7aa852ef322907b/packages/ace-linters/src/utils.ts#L37
   */
  mergeRanges = ([...ranges]: Ace.Range[]): Ace.Range => {
    const list = ranges.sort((a, b) => this.comparePoints(a.start, b.start))

    let nextRange = list[0]
    for (let i = 1; i < list.length; i++) {
      const currentRange = nextRange
      nextRange = list[i]

      const cmp = this.comparePoints(currentRange.end, nextRange.start)

      // If ranges are disjoint, continue
      if (cmp < 0) continue

      // If ranges are the same but empty, continue
      if (cmp == 0 && !currentRange.isEmpty() && !currentRange.isEmpty()) continue

      // If current range ends before next range, extend current range to next range
      if (this.comparePoints(currentRange.end, nextRange.end) < 0) {
        currentRange.end.row = nextRange.end.row
        currentRange.end.column = nextRange.end.column
      }

      // Remove next range from the list and go back one step
      list.splice(i, 1)
      nextRange = currentRange
      i--
    }

    return list[0]
  }

  /**
   * Compare two points.
   * One point is less than another if it comes before it in the document.
   */
  comparePoints(p1: Ace.Point, p2: Ace.Point) {
    return p1.row - p2.row || p1.column - p2.column
  }

  createRange(start: Ace.Point, end: Ace.Point) {
    return ace.Range.fromPoints(start, end)
  }

  getTextEditRange(textEdit: TextEdit | InsertReplaceEdit): { start: Ace.Point; end: Ace.Point } {
    if ('insert' in textEdit) {
      return this.mergeRanges([
        this.createRange(
          { row: textEdit.insert.start.line, column: textEdit.insert.start.character },
          { row: textEdit.insert.end.line, column: textEdit.insert.end.character },
        ),
        this.createRange(
          { row: textEdit.replace.start.line, column: textEdit.replace.start.character },
          { row: textEdit.replace.end.line, column: textEdit.replace.end.character },
        ),
      ])
    }

    return {
      start: { row: textEdit.range.start.line, column: textEdit.range.start.character },
      end: { row: textEdit.range.end.line, column: textEdit.range.end.character },
    }
  }
}
