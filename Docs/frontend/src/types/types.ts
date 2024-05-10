export type DocType = {
  id: string
  title: string
  content: string
  owner: string
  lastAccessed: string
  editors: string[]
  viewers: string[]
}

export type Operation = {
  docId: string
  version: string
  username: string
  operation: 'insert' | 'delete'
  position: number
}
