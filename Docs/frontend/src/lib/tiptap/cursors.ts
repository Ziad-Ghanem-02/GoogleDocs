import { Editor } from '@tiptap/react'

//* Cursors
export const setCursorPosition = (editor: Editor | null, position: number) => {
  if (!editor) return

  return editor.commands.focus(position)
}

export const getCursorPosition = (editor: Editor | null) => {
  if (!editor) return

  return editor.state.selection.$anchor.pos
}

// TODO Bonus: getCursorSelection
