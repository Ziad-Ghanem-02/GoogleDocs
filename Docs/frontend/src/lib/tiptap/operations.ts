import { Editor } from '@tiptap/react'
import { getRange, isBeginningOfNode } from './helpers'

//* Insert
export const insertChar = (
  editor: Editor | null,
  cursor: number,
  char: string,
) => {
  return editor?.chain().insertContentAt(cursor, char).focus().run()
}

//* Delete
export const deleteChar = (editor: Editor | null, cursor: number) => {
  const offset = isBeginningOfNode(editor) ? 2 : 1

  return editor
    ?.chain()
    .deleteRange(getRange(cursor - offset, offset))
    .focus()
    .run()
}
