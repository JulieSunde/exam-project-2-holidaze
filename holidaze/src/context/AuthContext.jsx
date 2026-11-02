
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user')
      return savedUser ? JSON.parse(savedUser) : null
    } catch {
      localStorage.removeItem('user')
      return null
    }
  })

  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem('accessToken')
  )

  function login(userData) {
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', userData.accessToken)

    setUser(userData)
    setAccessToken(userData.accessToken)
  }

  function logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')

    setUser(null)
    setAccessToken(null)
  }

  const isLoggedIn = Boolean(user && accessToken)

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
