import { Operation } from '@/types/types'
import { useEffect, useState } from 'react'
import sockjs from 'sockjs-client/dist/sockjs'
import Stomp from 'stompjs'
import useSession from './useSession'

function useOperation(docId: string) {
  const { user } = useSession()
  // Operations Request Queue
  const [operationsQueue, setOperationsQueue] = useState<Operation[]>([])
  // Current Request
  const [currentRequest, setCurrentRequest] = useState<Operation | null>(null)
  // Response
  const [response, setResponse] = useState<Operation | null>(null)

  // Websocket connection
  const [stompClient, setStompClient] = useState<Stomp.Client>()

  useEffect(() => {
    if (operationsQueue.length > 0) {
      setCurrentRequest(operationsQueue[0])
    }
  }, [operationsQueue])

  useEffect(() => {
    if (!response) return

    // Same User -> Neglect
    if (response?.username == user?.username) {
      // Remove it from queue
      setOperationsQueue((prev) => prev.slice(1, prev.length)) // Remove the first element
      setCurrentRequest(operationsQueue.length > 0 ? operationsQueue[0] : null)
    }

    // Diff User
  }, [response])

  // Socket Connection &
  useEffect(() => {
    // Establish a WS connection to the server
    const socket = new sockjs('http://localhost:8081/ws')
    const client = Stomp.over(socket) // STOMP is a simple text-orientated messaging protocol

    // Connect to the server
    client.connect(
      {
        // Authorization Header
        Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
      },
      () => {
        /**
         * Subscribe to the topic
         * The server will send messages to this topic
         * The client will receive these messages and choose the the subscribed topics
         * The client will update the state with the messages
         */
        client.subscribe(`/topic/operation/${docId}`, (response) => {
          console.log(`response: ${response.body}`)
          const operation: Operation = JSON.parse(response.body)
          setResponse(operation)
        })
      },
    )

    setStompClient(client)

    // return () => {
    //   client.disconnect(() => console.log('Disconnected from WS'))
    // }
  }, [docId])

  const sendMessage = (operation: Operation) => {
    stompClient?.send(`/app/operation/${docId}`, {}, JSON.stringify(operation))
  }

  return { operationsQueue, setOperationsQueue }
}

export default useOperation
