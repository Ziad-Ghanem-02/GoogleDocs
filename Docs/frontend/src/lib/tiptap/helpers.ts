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
