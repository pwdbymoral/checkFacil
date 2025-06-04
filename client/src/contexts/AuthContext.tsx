import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

import { AuthContext, type StaffUser, type AuthState } from './authContextCore'

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
