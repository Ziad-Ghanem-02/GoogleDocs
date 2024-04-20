import { ReactNode, createContext, useEffect, useState } from 'react'

const AuthContext = createContext<{
  token: string | null
}>({ token: null })

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('jwt_token'),
  )

  // useEffect to listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('jwt_token'))
    }

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange)

    // Cleanup function to remove listener on unmount
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
