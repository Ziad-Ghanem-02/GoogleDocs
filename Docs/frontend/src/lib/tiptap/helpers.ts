import { Editor } from '@tiptap/react'

export const getRange = (start: number, length: number) => {
  return {
    from: start,
    to: start + length,
  }
}

export const isBeginningOfNode = (editor: Editor | null) => {
  return editor?.state.selection.$from.parentOffset === 0
}

export const isEndOfNode = (editor: Editor | null) => {
  if (!editor) return false
  return (
    editor.state.selection.$from.parentOffset ===
    editor.state.selection.$from.parent.nodeSize - 2
  )
}

export const getContentLength = (editor: Editor | null) => {
  if (!editor) return 0
  return editor.state.doc.content.size
}
