import { createContext, useState, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'

interface StaffUser {
  id: string
  email: string
  name?: string
}

interface AuthState {
  isAuthenticated: boolean
  user: StaffUser | null
  token?: string | null
}

interface AuthContextType extends AuthState {
  login: (userData: StaffUser, token?: string) => void
  logout: () => void
}
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem('staffUser')
    const storedToken = localStorage.getItem('staffToken')

    if (storedUser) {
      setAuthState({
        isAuthenticated: true,
        user: JSON.parse(storedUser),
        token: storedToken,
      })
    }
  }, [])

  const login = (userData: StaffUser, token?: string) => {
    setAuthState({
      isAuthenticated: true,
      user: userData,
      token: token || null,
    })
    localStorage.setItem('staffUser', JSON.stringify(userData))
    if (token) {
      localStorage.setItem('staffToken', token)
    }
  }

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    })
    localStorage.removeItem('staffUser')
    localStorage.removeItem('staffToken')
  }

  const value = {
    ...authState,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
