import { supportedMarkTypes } from '@/types/types'
import { Editor, Range } from '@tiptap/react'

//* Styling
export const addStyling = (
  editor: Editor | null,
  type: supportedMarkTypes,
  cursor: number | Range,
  // selectionStart: number,
  // selectionLength: number = 0,
) => {
  if (!editor) return

  console.log('style: off')

  // Save the current selection
  const selection = editor.state.selection

  // Set the selection to the desired range
  if (typeof cursor === 'number') editor.commands.setTextSelection(cursor)
  else editor.commands.setTextSelection(cursor)

  // Apply styling
  editor.commands.toggleMark(type)

  // Restore the selection
  editor.commands.setTextSelection(selection)
}

export const applyBold = (editor: Editor | null) => {
  if (!editor) return
  return editor.chain().focus().toggleBold().run()
}

export const applyItalic = (editor: Editor | null) => {
  if (!editor) return
  return editor.chain().focus().toggleItalic().run()
}
