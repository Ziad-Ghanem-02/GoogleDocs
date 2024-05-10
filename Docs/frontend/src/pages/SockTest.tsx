import useSession from '@/hooks/useSession'
import { useEffect, useState } from 'react'
import Stomp from 'stompjs'
// to add global https://github.com/sockjs/sockjs-client/issues/439#issuecomment-1177124768
import sockjs from 'sockjs-client/dist/sockjs'

type Colab = {
  username: string
  message: string
}

const SockTest = () => {
  const session = useSession()
  const [stompClient, setStompClient] = useState<Stomp.Client>()
  const [colabs, setColabs] = useState<Colab[]>()

  useEffect(() => {
    // Establish a WS connection to the server
    const socket = new sockjs('http://localhost:8081/ws')
    const client = Stomp.over(socket) // STOMP is a simple text-orientated messaging protocol

    // Connect to the server
    client.connect(
      {
        Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
      },
      () => {
        // console.log('Connected to WS')

        /**
         * Subscribe to the topic
         * The server will send messages to this topic
         * The client will receive these messages and choose the the subscribed topics
         * The client will update the state with the messages
         */
        client.subscribe(`/topic/colab`, (response) => {
          console.log(`response: ${response.body}`)
          const colab: Colab = JSON.parse(response.body)
          setColabs((prev = []) => prev.concat([colab]))
        })
      },
    )

    setStompClient(client)

    // return () => {
    //   client.disconnect(() => console.log('Disconnected from WS'))
    // }
  }, [])

  const sendMessage = () => {
    stompClient?.send(
      `/app/colab`,
      {},
      JSON.stringify({ username: session.user?.username, message: 'Hello' }),
    )
  }

  return (
    <div>
      <h1>Socket Test</h1>
      {colabs?.map((colab, i) => (
        <div key={i}>
          {colab.username}:{colab.message}
        </div>
      ))}
      <button onClick={sendMessage}>Send Message</button>
    </div>
  )
}

export default SockTest
