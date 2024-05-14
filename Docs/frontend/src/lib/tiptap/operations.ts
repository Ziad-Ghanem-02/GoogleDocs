import { Editor, Range } from '@tiptap/react'
import { getRange, isBeginningOfNode } from './helpers'

//* Insert
export const insertChar = (
  editor: Editor | null,
  cursor: number | Range,
  char: string,
) => {
  if (char === '\n') {
    if (typeof cursor === 'number') {
      return editor?.chain().focus(cursor).splitBlock().focus().run()
    } else return editor?.chain().focus(cursor.from).splitBlock()
    // return editor
    //   ?.chain()
    //   .insertContentAt(
    //     cursor,
    //     [
    //       {
    //         type: 'paragraph',
    //       },
    //     ],
    //     {
    //       updateSelection: false,
    //       // parseOptions: {
    //       //   preserveWhitespace: true,
    //       // },
    //     },
    //   )
    //   .focus()
    //   .run()
  }
  return editor
    ?.chain()
    .insertContentAt(cursor, char, {
      updateSelection: false,
      parseOptions: {
        preserveWhitespace: true,
      },
    })
    .focus()
    .run()
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
