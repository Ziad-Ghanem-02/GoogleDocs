import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Code from '@tiptap/extension-code'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'

export const tiptapConfig = {
  extensions: [
    StarterKit,
    Heading.configure({
      HTMLAttributes: {
        class: 'text-2xl',
      },
    }),
    Blockquote.configure({
      HTMLAttributes: {
        class: 'border-l-4 ml-2 px-4 p-2',
      },
    }),
    Code.configure({
      HTMLAttributes: {
        class: 'rounded-sm bg-neutral-200 px-1',
      },
    }),
    BulletList.configure({
      HTMLAttributes: {
        class: 'list-disc pl-5',
      },
    }),
    OrderedList.configure({
      HTMLAttributes: {
        class: 'list-decimal pl-5',
      },
    }),
    ListItem,
  ],
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
    },
  },
  content: ``,
}
