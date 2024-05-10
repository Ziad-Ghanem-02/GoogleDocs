import StarterKit from '@tiptap/starter-kit'
// import Heading from '@tiptap/extension-heading'
// import Code from '@tiptap/extension-code'
// import BulletList from '@tiptap/extension-bullet-list'
// import OrderedList from '@tiptap/extension-ordered-list'
// import ListItem from '@tiptap/extension-list-item'
// import Blockquote from '@tiptap/extension-blockquote'

export const tiptapConfig = {
  extensions: [
    StarterKit,
  ],
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
    },
  },
  content: ``,
}
