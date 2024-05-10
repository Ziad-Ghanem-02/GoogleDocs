import { Editor } from '@tiptap/react'

//* Styling
type supportedMarkTypes = 'bold' | 'italic'
export const addStyling = (
  editor: Editor | null,
  type: supportedMarkTypes,
  selectionStart: number,
  selectionLength: number = 0,
) => {
  if (!editor) return

  // Save the current selection
  const selection = editor.state.selection

  // Set the selection to the desired range
  editor.commands.setTextSelection({
    from: selectionStart,
    to: selectionStart + selectionLength,
  })

  // Apply styling
  editor.commands.toggleMark(type)

  // Restore the selection
  editor.commands.setTextSelection(selection)
}

