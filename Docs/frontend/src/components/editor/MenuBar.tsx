import { Editor } from '@tiptap/react'
import { Button } from '../ui/button'
import { Bold, Italic } from 'lucide-react'

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <>
      <div className=''>
        <Button
          variant={editor.isActive('bold') ? 'default' : 'secondary'}
          size='icon'
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'secondary'}
          size='icon'
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={16} />
        </Button>
      </div>
    </>
  )
}

export default MenuBar
