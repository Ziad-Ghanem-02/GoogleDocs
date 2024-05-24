import { OT, supportedMarkTypes } from '@/types/types'
import { useEffect, useState } from 'react'
import Stomp from 'stompjs'
import useSession from './useSession'
import useSocket from './useSocket'
import { deleteChar, insertChar } from '@/lib/tiptap/operations'
import { Editor } from '@tiptap/react'
import { addStyling } from '@/lib/tiptap/styling'
import axio from '@/lib/axios'

const sendMessage = (operation: OT, stompClient?: Stomp.Client) => {
  stompClient?.send(
    `/app/ot/process/${operation.docId}`,
    {},
    JSON.stringify(operation),
  )
}

const applyOperation = (response: OT, editor: Editor) => {
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

const getUpdates = async (docId: string, version: number) => {
  const response = await axio.post(`/getUpdates/${docId}/${version}`)
  return response.data
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
    const asyncFn = async () => {
      if (!response) return
      console.log('response', response)

      let lastResponse = response

      // Same User (ACK) -> Neglect
      if (response?.username == user?.username) {
        // Remove it from queue
        setCurrentRequest(null)
      }
      // Diff User
      else {
        if (response.version === version) {
          // Transfrom request queue
          setOperationsQueue((prev) =>
            prev.map((currentOperation) => {
              // Lw el operations el fel queue maktob ka index b3d el response ba shafto bel far2 benhom
              let transfrom = 0

              if (currentOperation.from >= response.from) {
                if (response.operation === 'delete') {
                  transfrom = -1
                } else if (response.operation === 'insert') {
                  transfrom = response.content.length // Halyan be 1 alsha benb3at 1 char at a time
                }
              }

              return {
                ...currentOperation,
                from: response.from + transfrom,
                to: response.to + transfrom,
              }
            }),
          )
          setCurrentRequest(null) // Trigger send
          setVersion(response.version + 1)
          console.log('transformed', operationsQueue)
          // Apply the operation
          applyOperation(response, editor!)
        } else {
          const operations = await getUpdates(docId, version)
          console.log('operations', operations)

          for (const operation of operations) {
            applyOperation(operation, editor!)
            lastResponse = operation
          }
        }
      }

      // Remove the first element
      setOperationsQueue((prev) => prev.slice(1, prev.length))
      setVersion(lastResponse.version + 1)
    }

    asyncFn()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response])

  return { stompClient, setOperationsQueue }
}

export default useOperation
