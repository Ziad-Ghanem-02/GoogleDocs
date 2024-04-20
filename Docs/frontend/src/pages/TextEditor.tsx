import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { tiptapConfig } from '@/lib/tiptap_config'
import { useNavigate, useParams } from 'react-router-dom'
import SectionContainer from '@/components/SectionContainer'
import useSession from '@/hooks/useSession'
import { DocType } from '@/types/types'
import axio from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

const TextEditor = () => {
  const { docId } = useParams<{ docId: string }>()
  const editor = useEditor({
    ...tiptapConfig,
  })

  const session = useSession()
  const navigate = useNavigate()
  console.log('session', session.status)
  if (session.status === 'unauthenticated') {
    navigate('/')
  }

  const {
    data: doc,
    isError,
    isLoading,
  } = useQuery<DocType>({
    queryKey: ['doc'],
    queryFn: async () => {
      const response = await axio.get(`/docs/${docId}`)
      console.log('response', response.data)
      return response.data
    },
  })

  const [openMenuBar, setOpenMenuBar] = useState<boolean>(false)
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState('')

  return (
    <>
      {/* TODO: Document Settings: Add editors, viewers. Rename & Delete document */}
      {/* TODO: Editor's Menubar */}
      <SectionContainer className='h-screen bg-primary-foreground shadow-md'>
        <EditorContent editor={editor} autoFocus />
      </SectionContainer>
    </>
  )
}

export default TextEditor
