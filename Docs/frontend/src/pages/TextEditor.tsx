import { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { tiptapConfig } from '@/lib/tiptap_config'
import { useNavigate, useParams } from 'react-router-dom'
import SectionContainer from '@/components/SectionContainer'
import StarterKit from '@tiptap/starter-kit'
import useSession from '@/hooks/useSession'

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

  const [openMenuBar, setOpenMenuBar] = useState<boolean>(false)
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState('')
  
  return (
    <>
      <SectionContainer className='h-screen bg-primary-foreground shadow-md'>
        <EditorContent editor={editor} />
      </SectionContainer>
    </>
  )
}

export default TextEditor
