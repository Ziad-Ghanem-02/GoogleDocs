import { OT } from '@/types/types'
import { useEffect, useState } from 'react'
import Stomp from 'stompjs'
import useSession from './useSession'
import useSocket from './useSocket'
import { deleteChar, insertChar } from '@/lib/tiptap/operations'
import { Editor } from '@tiptap/react'

const sendMessage = (operation: OT, stompClient?: Stomp.Client) => {
  stompClient?.send(
    `/app/ot/process/${operation.docId}`,
    {},
    JSON.stringify(operation),
  )
}

function useOperation(docId: string, editor: Editor | null) {
  const { user } = useSession()

  //* OT
  const [version, setVersion] = useState(0)

  // Operations Request Queue
  const [operationsQueue, setOperationsQueue] = useState<OT[]>([])
  // Current Request
  const [currentRequest, setCurrentRequest] = useState<OT | null>(null)

  // Socket Connection & Response
  const { stompClient, response } = useSocket(docId)

  // Send
  useEffect(() => {
    console.log('operationsQueue', operationsQueue)
    if (operationsQueue.length === 0 || currentRequest) return
    setCurrentRequest(operationsQueue[0])
  }, [operationsQueue, currentRequest])
  useEffect(() => {
    console.log('currentRequest', currentRequest)
    if (!stompClient || !currentRequest) return

    currentRequest.version = `v${version}`
    sendMessage(currentRequest, stompClient)
    setVersion((prev) => prev + 1)
  }, [currentRequest, stompClient])

  // Receive
  useEffect(() => {
    if (!response) return

    console.log('response', response)

    // Remove the first element
    setOperationsQueue((prev) => prev.slice(1, prev.length))

    // Same User -> Neglect
    if (response?.username == user?.username) {
      // Remove it from queue
      setCurrentRequest(null)
    }
    // Diff User
    else {
      // Apply the operation
      if (response.operation === 'insert') {
        if (insertChar(editor, response.position, response.content))
          console
      } else if (response.operation === 'delete') {
        deleteChar(editor, response.position)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  return { setOperationsQueue }
}

export default useOperation

//* Testing
// [
//   {
//       "docId": "6623ffb8e6c5b37c3db0d620",
//       "version": "v0",
//       "username": "ahmed",
//       "operation": "insert",
//       "position": 32,
//       "content": "\n"
//   },
//   {
//       "docId": "6623ffb8e6c5b37c3db0d620",
//       "version": "v0",
//       "username": "ahmed",
//       "operation": "insert",
//       "position": 34,
//       "content": "\n"
//   },
//   {
//       "docId": "6623ffb8e6c5b37c3db0d620",
//       "version": "v0",
//       "username": "ahmed",
//       "operation": "insert",
//       "position": 36,
//       "content": ""
//   },
//   {
//       "docId": "6623ffb8e6c5b37c3db0d620",
//       "version": "v0",
//       "username": "ahmed",
//       "operation": "delete",
//       "position": 32,
//       "content": ""
//   }
// ]

// const res = {
//   version: '0',
//   operation: 'connect',
//   document: {
//     id: '6623ffb8e6c5b37c3db0d620',
//     title: 'testDoc',
//     content: 'testDoc content',
//     owner: 'ahmed',
//     lastAccessed: '2024-05-10T20:00:53.070+00:00',
//     editors: ['osos'],
//     viewers: [],
//   },
//   history: [],
// }

// * insert
//   {
//     "stepType": "replace",
//     "from": 30,
//     "to": 30,
//     "slice": {
//         "content": [
//             {
//                 "type": "text",
//                 "text": "a"
//             }
//         ]
//     }
// }
// * insert enter
//   {
//     "stepType": "replace",
//     "from": 30,
//     "to": 30,
//     "slice": {
//         "content": [
//             {
//                 "type": "paragraph"
//             },
//             {
//                 "type": "paragraph"
//             }
//         ],
//         "openStart": 1,
//         "openEnd": 1
//     },
//     "structure": true
// }
// * delete
//   {
//     "stepType": "replace",
//     "from": 28,
//     "to": 29
// }
// * delete enter
//   {
//     "stepType": "replace",
//     "from": 16,
//     "to": 18,
//     "structure": true
// }
