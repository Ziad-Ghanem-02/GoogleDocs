import { useEditor, EditorContent } from '@tiptap/react'
import { useNavigate, useParams } from 'react-router-dom'
import SectionContainer from '@/components/SectionContainer'
import useSession from '@/hooks/useSession'
import { DocType, Operation } from '@/types/types'
import axio from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import DocSettingsBar from '@/components/editor/DocSettingsBar'
import { useEffect } from 'react'
import { tiptapConfig } from '@/config/tiptap_config'
import MenuBar from '@/components/editor/MenuBar'
import { Separator } from '@radix-ui/react-dropdown-menu'
import useOperation from '@/hooks/useOperation'
import TextSkeleton from '@/components/skeletons/text-skeleton'
import CardSkeleton from '@/components/skeletons/card-skeleton'
import { getContentLength } from '@/lib/tiptap/helpers'
import { getCursorPosition, getCursorPositionState } from '@/lib/tiptap/cursors'

const TextEditor = () => {
  const { id: docId } = useParams()
  const { user, status } = useSession()
  const navigate = useNavigate()
  // console.log('session', status)
  if (status === 'unauthenticated' && !user) {
    navigate('/')
  }

  const sendMessage = (
    operation: Operation,
    cursor: number,
    content: string,
  ) => {
    if (!user) return
    setOperationsQueue((prev) => [
      ...prev,
      {
        docId: docId!,
        version: `v${0}`,
        username: user.username,
        operation: operation,
        position: cursor,
        content: content,
      },
    ])
  }

  const editor = useEditor(
    {
      ...tiptapConfig,
      editorProps: {
        ...tiptapConfig.editorProps,
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

          sendMessage('insert', from, text)
          return false
        },
      },
    },
    [user],
  )

  const { setOperationsQueue } = useOperation(docId!, editor)

  // Load document from DB
  // TODO: Khaliha men ws endpoint
  const {
    data: doc,
    isLoading,
    isError,
  } = useQuery<DocType>({
    queryKey: ['doc'],
    queryFn: async () => {
      const response = await axio.get(`/docs/${docId}`)
      console.log('doc', response.data)
      return response.data
    },
  })

  useEffect(() => {
    if (editor && doc) {
      editor?.commands.setContent(doc.content || '')
      editor.commands.insertContentAt(getContentLength(editor), 'Hello World ')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, doc])

  // Testing
  useEffect(() => {
    console.log(editor?.getHTML())
    console.log('focus: ', getCursorPosition(editor))
  }, [editor?.state, editor])

  if (isLoading)
    return (
      <SectionContainer
        className='flex h-screen w-full flex-col items-center gap-20'
        variant='wide'
      >
        <TextSkeleton />
        <CardSkeleton />
      </SectionContainer>
    )
  if (isError)
    return (
      <SectionContainer>
        <div>Error...</div>
      </SectionContainer>
    )

  return (
    <>
      {/* TODO: Document Settings: Add editors, viewers. Rename & Delete document */}
      <SectionContainer className='flex items-center gap-4 p-0'>
        {docId && <DocSettingsBar doc={doc!} />}
        {/* <Button
          onClick={() => {
            const cursor = getCursorPosition(editor)!
            deleteChar(editor, cursor)
          }}
        >
          Delete
        </Button> */}
      </SectionContainer>
      <Separator />
      <SectionContainer className='flex w-full justify-center p-0'>
        <MenuBar editor={editor} />
      </SectionContainer>

      <SectionContainer
        onClick={() => editor?.commands.focus()}
        className='h-screen bg-primary-foreground shadow-md'
      >
        <EditorContent editor={editor} autoFocus />
      </SectionContainer>
    </>
  )
}

export default TextEditor

// // if (!user) return true // Prevent user from editing if not authenticated
// // setOperationsQueue((prev) => [
// //   ...prev,
// //   {
// //     operation: 'insert',
// //     position: from,
// //     username: user.username || 'anonymous', // Da mesh hyehsal isa
// //     version: 'v0',
// //     docId: docId!,
// //   },
// // ])

// // // Apply the step to the document
// // const result = step.apply(transaction.doc)
// // Create a new transaction with the step
// const newTransaction = editor.state.tr.step(stepJson as Step)
// console.log(`New Transaction: `, newTransaction)
// // Apply the transaction to the editor's state
// // const newState = editor.state.apply(newTransaction)

// // console.log(`Result doc: `, result.doc?.toJSON())

// --------
// editor.on('transaction', ({ transaction }) => {
//   console.log('onTransaction', transaction)
//   // editor.view.dispatch(editor.state.tr.step(transaction.steps[0] as Step))

//   // Add to operations queue
//   if (!user) return // Prevent user from editing if not authenticated

//   transaction.steps.forEach((step, index) => {
//     console.log(`Step ${index + 1}:`)
//     console.log(`Step: `, step)
//     console.log(`Step Type: ${step.getMap()}`)
//     console.log(`Step JSON: ${' '}`, step.toJSON())
//     const stepJson = step.toJSON()
//     // stepJson.from = 1
//     // stepJson.to = 2

//     let content = ''
//     let operation: Operation = 'delete'
//     if ('slice' in stepJson) {
//       operation = 'insert'
//       const contentChange = stepJson.slice.content
//       console.log(`Content Change: `, contentChange)
//       if (contentChange.length === 1 && contentChange[0].type === 'text')
//         content = contentChange[0].text
//       else if (contentChange.length > 1) content = '\n'
//     }

//     setOperationsQueue((prev) => [
//       ...prev,
//       {
//         docId: docId!,
//         version: 'v0',
//         username: user.username,
//         operation: operation,
//         position: stepJson.from,
//         content: content,
//       },
//     ])
//   })
// })
// insertChar(editor, 10, 'a')

// const newTransaction = {
//   doc: {
//     type: 'doc',
//     content: [
//       {
//         type: 'paragraph',
//         content: [
//           {
//             type: 'text',
//             text: 'testDoc content',
//           },
//         ],
//       },
//       {
//         type: 'paragraph',
//         content: [
//           {
//             type: 'text',
//             text: 'Hello World s',
//           },
//         ],
//       },
//     ],
//   },
//   steps: [
//     {
//       stepType: 'replace',
//       from: 30,
//       to: 30,
//       slice: {
//         content: [
//           {
//             type: 'text',
//             text: 's',
//           },
//         ],
//       },
//     },
//   ],
//   docs: [
//     {
//       type: 'doc',
//       content: [
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'testDoc content',
//             },
//           ],
//         },
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'Hello World ',
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   mapping: {
//     maps: [
//       {
//         ranges: [30, 0, 1],
//         inverted: false,
//       },
//     ],
//     from: 0,
//     to: 1,
//   },
//   curSelectionFor: 1,
//   updated: 5,
//   meta: {},
//   time: 1715408443053,
//   curSelection: {
//     type: 'text',
//     anchor: 31,
//     head: 31,
//   },
//   storedMarks: null,
// } as unknown as Transaction
// editor.state.apply(newTransaction)
