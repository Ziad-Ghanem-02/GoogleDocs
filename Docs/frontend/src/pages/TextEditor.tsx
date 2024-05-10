import { useEditor, EditorContent } from '@tiptap/react'
import { useNavigate, useParams } from 'react-router-dom'
import SectionContainer from '@/components/SectionContainer'
import useSession from '@/hooks/useSession'
import { DocType } from '@/types/types'
import axio from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'
import DocSettingsBar from '@/components/editor/DocSettingsBar'
import { useEffect } from 'react'
import { tiptapConfig } from '@/config/tiptap_config'
import MenuBar from '@/components/editor/MenuBar'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { getCursorPosition } from '@/lib/tiptap/cursors'
import { Button } from '@/components/ui/button'
import { deleteChar } from '@/lib/tiptap/operations'
import useOperation from '@/hooks/useOperation'
import TextSkeleton from '@/components/skeletons/text-skeleton'
import CardSkeleton from '@/components/skeletons/card-skeleton'

const TextEditor = () => {
  const { id: docId } = useParams()
  const session = useSession()
  const navigate = useNavigate()
  // console.log('session', session.status)
  if (session.status === 'unauthenticated' && !session.user) {
    navigate('/')
  }

  const { setOperationsQueue } = useOperation(docId!)

  const editor = useEditor({
    ...tiptapConfig,
    editorProps: {
      ...tiptapConfig.editorProps,
      handleKeyDown(view, event) {
        // event.preventDefault()
        const state = view.state
        if (event.key === 'Enter') {
          console.log('Enter pressed')
          console.log('focus: ', state.selection.$anchor.pos)
          // editor?.commands.enter()
          return false
        } else if (event.key === 'Backspace') {
          console.log('Backspace pressed')
          // editor?.commands.deleteRange({from: })
          view.state.applyTransaction(view.state.tr.delete(0, 1))

          return true
        }
        return false
      },
      handleTextInput(view, from, to, text) {
        console.log('from', from)
        console.log('to', to)
        console.log('text', text)
        if (!session.user) return true // Prevent user from editing if not authenticated
        setOperationsQueue((prev) => [
          ...prev,
          {
            operation: 'insert',
            position: from,
            username: session.user?.username || 'anonymous', // Da mesh hyehsal isa
            version: 'v0',
            docId: docId!,
          },
        ])
        return false
      },
      // handlePaste(view, event, slice) {},
    },
    onUpdate({ transaction }) {
      console.log('editor updated')
      console.log('transaction', transaction)
    },
  })

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
      console.log('response', response.data)
      return response.data
    },
  })

  useEffect(() => {
    if (editor && doc) {
      editor?.commands.setContent(doc.content || '')

      // Testing
      // Insert Content
      // editor.commands.enter()
      editor.commands.insertContentAt(17, 'Hello World ')

      // addStyling(editor, 'bold', 18, 2)
    }
    console.log(editor?.getHTML())
  }, [editor, doc])

  // Testing
  useEffect(() => {
    console.log(editor?.getHTML())
    console.log('focus: ', editor?.state.selection.$anchor.pos)
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
