import { DocType } from '@/types/types'

export const isOwner = (doc: DocType, username?: string) => {
  return username === doc.owner
}

export const isEditor = (doc: DocType, username?: string) => {
  return (
    username === doc.owner || doc.editors.find((editor) => editor === username)
  )
}

export const isViewer = (doc: DocType, username?: string) => {
  return doc.viewers.find((viewer) => viewer === username)
}
