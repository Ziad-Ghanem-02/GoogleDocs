export type DocType = {
  id: string
  title: string
  content: string
  owner: string
  lastAccessed: string
  editors: string[]
  viewers: string[]
}

export type supportedMarkTypes = 'bold' | 'italic'

export type Operation =
  | 'insert'
  | 'delete'
  | 'connect'
  | 'nack'
  | `style:${string}`

export type OT = {
  docId: string
  version: number
  username: string
  operation: Operation
  // position: number
  from: number
  to: number
  content: string
  docContent: string
}
