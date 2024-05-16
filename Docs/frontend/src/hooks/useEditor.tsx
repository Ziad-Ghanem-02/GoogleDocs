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

const useEditor = (doc?: DocType, version: number = 0) => {
  const { id: docId } = useParams()
  const { user } = useSession()

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
                    docContent: JSON.stringify(this.editor.getJSON()),
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
                    docContent: JSON.stringify(this.editor.getJSON()),
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
          let docContent = JSON.stringify(view.state.toJSON())
          if (keyPressed === 'Backspace') {
            operation = 'delete'
            content = ''
            docContent = JSON.stringify(
              view.state.apply(view.state.tr.split(cursor)).toJSON(),
            )
          } else {
            operation = 'insert'
            content = keyPressed === 'Enter' ? '\n' : keyPressed
            docContent = JSON.stringify(
              view.state.apply(view.state.tr.delete(cursor, cursor)),
            )
          }
          sendMessage(operation, cursor, content, docContent)
          return false
        },
        handleTextInput: (_view, from, to, text) => {
          console.log('handleTextInput', from, to, text)
          console.log('session', user)
          if (!user) return false // Prevent user from editing if not authenticated

          console.log('Before Insert:', _view.state.toJSON())
          const json = JSON.stringify(
            _view.state.apply(_view.state.tr.insertText(text)),
          )
          console.log('After Insert:', json)
          sendMessage('insert', { from, to }, text, json)
          return false
        },
      },
      // content: docContent,
      editable: doc ? (isViewer(doc!, user?.username) ? false : true) : false,
    },
    [user, doc],
  )

  const sendMessage = (
    operation: Operation,
    cursor: number | Range,
    content: string,
    doc_content: string,
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
