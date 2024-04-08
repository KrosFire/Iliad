import typescriptLsp from '@/lsp/typescriptLsp'
import { KnownLanguages, WorkspaceActions } from '~/types'

/**
 * Updates file's editor content
 */
const updateEditorContent: WorkspaceActions['updateEditorContent'] = async function (fileId, content) {
  this.files[fileId].editorContent = content

  this.files[fileId].saved = false

  switch (this.files[fileId].lang) {
    case KnownLanguages.Typescript: {
      typescriptLsp.documentDidChange(this.files[fileId].path, content)
    }
  }
}

export default updateEditorContent
