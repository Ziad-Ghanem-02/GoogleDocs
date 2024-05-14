import StarterKit from '@tiptap/starter-kit'
import Bold from '@tiptap/extension-heading'
import Italic from '@tiptap/extension-heading'
// import Heading from '@tiptap/extension-heading'
// import Code from '@tiptap/extension-code'
// import BulletList from '@tiptap/extension-bullet-list'
// import OrderedList from '@tiptap/extension-ordered-list'
// import ListItem from '@tiptap/extension-list-item'
// import Blockquote from '@tiptap/extension-blockquote'

export const tiptapConfig = {
  extensions: [
    StarterKit,
    Bold.extend({
      addKeyboardShortcuts() {
        return {
          // ↓ your new keyboard shortcut
          'Mod-b': () => this.editor.commands.toggleBulletList(),
        }
      },
    }),
    Italic.extend({
      addKeyboardShortcuts() {
        return {
          // ↓ your new keyboard shortcut
          'Mod-i': () => this.editor.commands.toggleBulletList(),
        }
      },
    }),
  ],
  editorProps: {
    attributes: {
      class:
        'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
    },
  },
  content: ``,
}
