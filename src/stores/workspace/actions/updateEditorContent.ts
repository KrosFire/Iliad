import { WorkspaceActions } from '~/types'

/**
 * Updates file's editor content
 */
const updateEditorContent: WorkspaceActions['updateEditorContent'] = async function (fileId, content) {
  this.files[fileId].editorContent = content

  this.files[fileId].saved = false
}

export default updateEditorContent
