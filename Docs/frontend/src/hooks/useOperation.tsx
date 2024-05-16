import { OT, supportedMarkTypes } from '@/types/types'
import { useEffect, useState } from 'react'
import Stomp from 'stompjs'
import useSession from './useSession'
import useSocket from './useSocket'
import { deleteChar, insertChar } from '@/lib/tiptap/operations'
import { Editor } from '@tiptap/react'
import { addStyling } from '@/lib/tiptap/styling'

const sendMessage = (operation: OT, stompClient?: Stomp.Client) => {
  stompClient?.send(
    `/app/ot/process/${operation.docId}`,
    {},
    JSON.stringify(operation),
  )
}

function useOperation(
  docId: string,
  editor: Editor | null,
  initVersion: number,
) {
  const { user } = useSession()

  //* OT
  const [version, setVersion] = useState(initVersion)

  // Operations Request Queue
  const [operationsQueue, setOperationsQueue] = useState<OT[]>([])
  // Current Request
  const [currentRequest, setCurrentRequest] = useState<OT | null>(null)

  // Socket Connection & Response
  const { stompClient, response } = useSocket(docId)

  useEffect(() => {
    setVersion(initVersion - 1)
  }, [initVersion])

  //* Send
  useEffect(() => {
    console.log('operationsQueue', operationsQueue)
    console.log('currentRequest', currentRequest)

    if (operationsQueue.length === 0 || currentRequest) return
    setCurrentRequest(operationsQueue[0])
  }, [operationsQueue, currentRequest, version])

  useEffect(() => {
    console.log('currentRequest', currentRequest)
    if (!stompClient || !currentRequest) return

    currentRequest.version = version
    sendMessage(currentRequest, stompClient)
    setVersion((prev) => prev + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRequest, stompClient])

  //* Receive
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
      // Transfrom request queue

      setOperationsQueue((prev) =>
        prev.map((currentOperation) => {
          const transfrom =
            currentOperation.from >= response.from
              ? currentOperation.from - response.from
              : 0

          return {
            ...currentOperation,
            version: response.version + 1,
            from: response.from + transfrom,
            to: response.to + transfrom,
          }
        }),
      )
      setVersion(response.version + 1)
      console.log('transformed', operationsQueue)
      // Apply the operation
      if (response.operation === 'insert') {
        if (insertChar(editor, response.from, response.content))
          console.log('inserted')
      } else if (response.operation === 'delete') {
        deleteChar(editor, response.from)
      } else if (response.operation.startsWith('style:')) {
        // Add styling
        const style = response.operation.split(':')[1] as supportedMarkTypes
        addStyling(editor, style, { from: response.from, to: response.to })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  return { stompClient, setOperationsQueue }
}

export default useOperation
