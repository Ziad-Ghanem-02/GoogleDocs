import { EditorContent } from '@tiptap/react'
import { useNavigate, useParams } from 'react-router-dom'
import SectionContainer from '@/components/SectionContainer'
import useSession from '@/hooks/useSession'
import { DocType } from '@/types/types'
import axio from '@/lib/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import DocSettingsBar from '@/components/editor/DocSettingsBar'
import { useEffect, useState } from 'react'
import MenuBar from '@/components/editor/MenuBar'
import { Separator } from '@radix-ui/react-dropdown-menu'
import TextSkeleton from '@/components/skeletons/text-skeleton'
import CardSkeleton from '@/components/skeletons/card-skeleton'
import { getCursorPosition } from '@/lib/tiptap/cursors'
import useEditor from '@/hooks/useEditor'

const TextEditor = () => {
  const { id: docId } = useParams()
  const { user, status } = useSession()
  const navigate = useNavigate()
  // console.log('session', status)
  if (status === 'unauthenticated' && !user) {
    navigate('/')
  }

  const [version, setVersion] = useState(0)
  // Load document from DB
  // TODO: Khaliha men ws endpoint
  const {
    data: doc,
    isLoading,
    isError,
  } = useQuery<DocType>({
    queryKey: ['doc'],
    queryFn: async () => {
      const response = await axio.get(`/getDoc/${docId}`)
      const doc = response.data.document
      console.log('doc', doc)
      console.log('version', response.data.version)
      setVersion(response.data.version + 1)
      return doc
    },
    staleTime: Infinity, // Prevents the query from being invalidated every window switching
  })

  const { editor, setOperationsQueue } = useEditor(doc, version, doc?.content)
  const mutate = useMutation({
    mutationKey: ['saveDoc'],
    mutationFn: async (docId: string) => {
      console.log('docId: ', docId)
      const response = await axio.post('/saveDoc/' + docId)
      if (response.status === 200) console.log('Document saved successfully')
      else console.log('Error saving document')
      return response.data
    },
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!doc?.id) return
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        console.log('Ctrl + S was pressed')
        mutate.mutate(doc.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [doc?.id]) // Empty dependency array means this effect runs once when the component mounts

  useEffect(() => {
    if (editor && doc) {
      editor?.commands.setContent(doc.content || '')
      // editor.commands.insertContentAt(getContentLength(editor), 'Hello World ')
      editor.getHTML()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, doc])

  // Testing
  useEffect(() => {
    console.log('?', editor?.getHTML())
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
        {/* {stompClient?.disconnect && <div>Disconnected from WS</div>} */}
      </SectionContainer>
    )

  return (
    <>
      {/* TODO: Document Settings: Add editors, viewers. Rename & Delete document */}
      <SectionContainer className='flex items-center gap-4 p-0'>
        {docId && <DocSettingsBar doc={doc!} />}
      </SectionContainer>
      <Separator />
      <SectionContainer className='flex w-full justify-center p-0'>
        <MenuBar editor={editor} setOperationsQueue={setOperationsQueue} />
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
