import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/components/providers/AuthProvider'
import { decodeToken, useJwt } from 'react-jwt'
import { removeToken } from '@/lib/utils'

type User = {
  name: string
  username: string
  imageUrl?: string
}

type LoadingSession = {
  status: 'loading'
  user: null
}

type AuthenticatedSession = {
  status: 'authenticated'
  user: User
  expiresAt: number
}

type UnauthenticatedSession = {
  status: 'unauthenticated'
  user: null
}

type Session = LoadingSession | AuthenticatedSession | UnauthenticatedSession

function useSession() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useSession must be used within an AuthProvider')
  }

  const { decodedToken, isExpired } = useJwt(context.token || '')
  const [session, setSession] = useState<Session>({
    status: 'loading',
    user: null,
  })

  // exp: 1712281498, iat: 1712277898, user: UserTypes

  useEffect(() => {
    const token = decodeToken<{
      exp: number
      iat: number
      user: User
    }>(context.token || '')
    if (token) {
      setSession({
        status: 'authenticated',
        user: token.user,
        expiresAt: token.exp,
      })
    }
  }, [context.token])

  if (!context.token) return { status: 'unauthenticated', user: null }
  if (isExpired) {
    removeToken()
    return { status: 'unauthenticated', user: null }
  }

  // console.log('decodedToken', decodedToken)

  session.user = decodedToken as User
  session.status = 'authenticated'

  return session
}

export default useSession
