import { useState, useEffect } from 'react'

import { AuthContext, type StaffUser, type AuthState } from './authContextCore'

import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  })
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('staffToken')
      const storedUserJSON = localStorage.getItem('staffUser')

      if (storedToken && storedUserJSON) {
        const storedUser: StaffUser = JSON.parse(storedUserJSON)
        setAuthState({
          isAuthenticated: true,
          user: storedUser,
          token: storedToken,
        })
      }
    } catch (error) {
      console.error('AuthProvider: Erro ao restaurar sessão:', error)
      localStorage.removeItem('staffUser')
      localStorage.removeItem('staffToken')
    } finally {
      setInitialLoading(false)
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
    initialLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
