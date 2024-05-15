import { OT } from '@/types/types'
import { useEffect, useState } from 'react'
import sockjs from 'sockjs-client/dist/sockjs'
import Stomp from 'stompjs'

const useSocket = (docId: string) => {
  // Websocket connection
  const [stompClient, setStompClient] = useState<Stomp.Client>()
  const [response, setResponse] = useState<OT | null>(null)

  // Socket Connection &
  useEffect(() => {
    // Establish a WS connection to the server
    const socket = new sockjs(import.meta.env.VITE_BE_BASE_URL + '/ws') // Create a new WebSocket object with the URL (base URL + /ws
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
        client.subscribe(`/topic/ot/connect/${docId}`, (response) => {
          // TODO
          console.log(`response: ${response.body}`)
          const operation: OT = JSON.parse(response.body)
          setResponse(operation)
        })
        client.subscribe(`/topic/ot/process/${docId}`, (response) => {
          console.log(`response: ${response.body}`)
          const operation: OT = JSON.parse(response.body)
          setResponse(operation)
        })
      },
    )

    setStompClient(client)

    // return () => {
    //   client.disconnect(() => console.log('Disconnected from WS'))
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docId])
  return { stompClient, response }
}

export default useSocket
