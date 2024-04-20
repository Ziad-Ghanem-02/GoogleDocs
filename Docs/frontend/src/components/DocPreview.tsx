import { DocType } from '@/types/types'
import { Card, CardContent, CardHeader } from './ui/card'
import { EditorContent, useEditor } from '@tiptap/react'
import { tiptapConfig } from '@/lib/tiptap_config'
import StarterKit from '@tiptap/starter-kit'
import { formatDate, formatText } from '@/lib/utils'
import { Link } from 'react-router-dom'
import DocOptions from './DocOptions/DocOptions'

const DocPreview = ({ doc }: { doc: DocType }) => {
  const editor = useEditor({
    ...tiptapConfig,
    content: doc.content,
    editable: false,
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: 'text-[0.4rem]',
          },
        },
      }),
    ],
  })
  return (
    <>
      <Link to={`/doc/${doc.id}`}>
        <Card className='flex h-80 flex-col justify-between gap-2 rounded-md shadow-md'>
          <CardHeader className='grow bg-muted pb-0'>
            <div className='p-2'>
              <EditorContent editor={editor} />
            </div>
          </CardHeader>
          <CardContent className='h-20'>
            <div className='flex items-center justify-between'>
              <h6 className='text-lg font-semibold'>{formatText(doc.title)}</h6>
              {/* TODO: Add options dropdown (Rename, delete, Open in a new tab) */}
              <DocOptions doc={doc} />
            </div>
            <p className='text-sm text-muted-foreground'>
              {formatDate(doc.lastAccessed)}
            </p>
          </CardContent>
        </Card>
      </Link>
    </>
  )
}

export default DocPreview
