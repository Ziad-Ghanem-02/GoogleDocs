import { useParams } from 'react-router-dom'
import useSession from './useSession'
import { DocType, Operation } from '@/types/types'
import { useEditor as useDefaultEditor, Range } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import { getCursorPositionState } from '@/lib/tiptap/cursors'
import useOperation from './useOperation'
import { isViewer } from '@/lib/permissions'
import { useEffect, useState } from 'react'

const useEditor = (
  doc?: DocType,
  version: number = 0,
  initialContnent: string = '',
) => {
  const { id: docId } = useParams()
  const { user } = useSession()

  const [docContent, setDocContent] = useState<string>(initialContnent)
  const editor = useDefaultEditor(
    {
      extensions: [
        StarterKit,
        Bold.extend({
          addKeyboardShortcuts() {
            return {
              // ↓ your new keyboard shortcut
              'Mod-b': () => {
                if (!user || !editor) return true

                const selectionRange = this.editor.state.selection.ranges[0]
                const range: Range = {
                  from: selectionRange.$from.pos,
                  to: selectionRange.$to.pos,
                }

                setOperationsQueue((prev) => [
                  ...prev,
                  {
                    docId: docId!,
                    version: version,
                    username: user.username,
                    operation: 'style:bold',
                    ...range,
                    content: '',
                    docContent: this.editor.getHTML(),
                  },
                ])
                return this.editor.commands.toggleBold()
              },
            }
          },
        }),
        Italic.extend({
          addKeyboardShortcuts() {
            return {
              // ↓ your new keyboard shortcut
              'Mod-i': () => {
                if (!user || !editor) return true

                const selectionRange = this.editor.state.selection.ranges[0]
                const range: Range = {
                  from: selectionRange.$from.pos,
                  to: selectionRange.$to.pos,
                }

                setOperationsQueue((prev) => [
                  ...prev,
                  {
                    docId: docId!,
                    version: version,
                    username: user.username,
                    operation: 'style:italic',
                    ...range,
                    content: '',
                    docContent: this.editor.getHTML(),
                  },
                ])
                return this.editor.commands.toggleItalic()
              },
            }
          },
        }),
      ],
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
        },
        handleKeyDown: (view, event) => {
          console.log('handleKeyPress', event)
          console.log('session', user)
          console.log('step', getCursorPositionState(view.state))
          if (!user) return false // Prevent user from editing if not authenticated

          // Handled by handleTextInput, Maynf3sh ne3melha henak alshan mesh hy type al char 3ndena bs hy insert henak
          if (event.code === 'Space') return false

          if (
            event.key !== 'Enter' &&
            event.code !== 'Space' &&
            event.key !== 'Backspace'
          )
            return false

          const cursor = getCursorPositionState(view.state)
          const keyPressed = event.key
          let content = keyPressed
          let operation: Operation = 'delete'
          if (keyPressed === 'Backspace') {
            operation = 'delete'
            content = ''
          } else {
            operation = 'insert'
            content = keyPressed === 'Enter' ? '\n' : keyPressed
          }

          sendMessage(operation, cursor, content)
          return false
        },
        handleTextInput: (_view, from, to, text) => {
          console.log('handleTextInput', from, to, text)
          console.log('session', user)
          if (!user) return false // Prevent user from editing if not authenticated

          // console.log(
          //   '?After Insert:',
          //   generateHTML(_view.state.doc.content.toJSON(), [
          //     Document,
          //     Paragraph,
          //     Bold,
          //     Italic,
          //     Text,
          //   ]).toString(),
          // )
          sendMessage('insert', { from, to }, text)
          return false
        },
      },
      // content: docContent,
      editable: !doc || isViewer(doc!, user?.username) ? false : true,
      onUpdate: ({ editor }) => {
        console.log('onUpdate', editor.getHTML())
        setDocContent(editor.getHTML())
        console.log('onUpdate docContent', docContent)
      },
    },
    [user, doc, setDocContent],
  )

  useEffect(() => {
    if (!editor) return
    // console.log('editor updated:', editor.getHTML())
    setDocContent(editor?.getHTML())
    // console.log('docContent updated:', docContent)
  }, [editor])

  const sendMessage = (
    operation: Operation,
    cursor: number | Range,
    content: string,
    doc_content: string = docContent,
  ) => {
    if (!user || !editor) return
    if (typeof cursor === 'number')
      setOperationsQueue((prev) => [
        ...prev,
        {
          docId: docId!,
          version: version,
          username: user.username,
          operation: operation,
          // position: cursor,
          from: cursor,
          to: cursor,
          content: content,
          docContent: doc_content,
        },
      ])
    else
      setOperationsQueue((prev) => [
        ...prev,
        {
          docId: docId!,
          version: version,
          username: user.username,
          operation: operation,
          // position: cursor,
          ...cursor,
          content: content,
          docContent: doc_content,
        },
      ])
  }

  const { stompClient, setOperationsQueue } = useOperation(
    docId!,
    editor,
    version,
  )

  return { editor, stompClient, setOperationsQueue }
}

export default useEditor
