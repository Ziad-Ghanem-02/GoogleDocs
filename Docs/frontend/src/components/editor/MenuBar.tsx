import { Editor, Range } from '@tiptap/react'
import { Button } from '../ui/button'
import { Bold, Italic } from 'lucide-react'
import { useParams } from 'react-router-dom'
import useSession from '@/hooks/useSession'
import { Dispatch } from 'react'
import { OT } from '@/types/types'

const MenuBar = ({
  editor,
  setOperationsQueue,
}: {
  editor: Editor | null
  setOperationsQueue: Dispatch<React.SetStateAction<OT[]>>
}) => {
  const { id: docId } = useParams()
  const { user } = useSession()

  if (!editor || !user) {
    return null
  }
  return (
    <>
      <div className=''>
        <Button
          variant={editor.isActive('bold') ? 'default' : 'secondary'}
          size='icon'
          onClick={() => {
            const selectionRange = editor.state.selection.ranges[0]
            const range: Range = {
              from: selectionRange.$from.pos,
              to: selectionRange.$to.pos,
            }

            setOperationsQueue((prev) => [
              ...prev,
              {
                docId: docId!,
                version: 0,
                username: user.username,
                operation: 'style:bold',
                ...range,
                content: '',
              },
            ])
            editor.chain().focus().toggleBold().run()
          }}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'secondary'}
          size='icon'
          onClick={() => {
            const selectionRange = editor.state.selection.ranges[0]
            const range: Range = {
              from: selectionRange.$from.pos,
              to: selectionRange.$to.pos,
            }

            setOperationsQueue((prev) => [
              ...prev,
              {
                docId: docId!,
                version: 0,
                username: user.username,
                operation: 'style:italic',
                ...range,
                content: '',
              },
            ])
            editor.chain().focus().toggleItalic().run()
          }}
        >
          <Italic size={16} />
        </Button>
      </div>
    </>
  )
}

export default MenuBar
