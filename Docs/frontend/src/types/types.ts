export type DocType = {
  id: string
  title: string
  content: string
  owner: string
  lastAccessed: string
  editors: string[]
  viewers: string[]
}
export type Operation = 'insert' | 'delete'

export type OT = {
  docId: string
  version: string
  username: string
  operation: Operation
  position: number
  content: string
}
