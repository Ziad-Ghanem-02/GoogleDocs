export type DocType = {
  id: string
  title: string
  content: string
  ownerID: string
  lastAccessed: string
  editors: string[]
  viewers: string[]
}

export type Operation = {
  version: string
  username: string
  operation: 'insert' | 'delete'
  position: number
}
