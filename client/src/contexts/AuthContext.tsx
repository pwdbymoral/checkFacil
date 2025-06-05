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

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.info('AuthProvider: Verificando sessão armazenada...')
    try {
      const storedToken = localStorage.getItem('staffToken')
      const storedUserJSON = localStorage.getItem('staffUser')

      if (storedToken && storedUserJSON) {
        const storedUser: StaffUser = JSON.parse(storedUserJSON)

        // eslint-disable-next-line no-console
        console.info('AuthProvider: Sessão encontrada e restaurada.', {
          user: storedUser,
          token: storedToken,
        })
        setAuthState({
          isAuthenticated: true,
          user: storedUser,
          token: storedToken,
        })
      } else {
        // eslint-disable-next-line no-console
        console.info('AuthProvider: Nenhuma sessão válida encontrada no localStorage.')
        localStorage.removeItem('staffUser')
        localStorage.removeItem('staffToken')
        setAuthState({ isAuthenticated: false, user: null, token: null })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('AuthProvider: Erro ao restaurar sessão do localStorage:', error)
      localStorage.removeItem('staffUser')
      localStorage.removeItem('staffToken')
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      })
    }
  }, [])

  const login = (userData: StaffUser, token?: string) => {
    // eslint-disable-next-line no-console
    console.info('AuthProvider: Efetuando login', { userData, token })
    const tokenToStore = token || null
    setAuthState({
      isAuthenticated: true,
      user: userData,
      token: tokenToStore,
    })
    localStorage.setItem('staffUser', JSON.stringify(userData))
    if (tokenToStore) {
      localStorage.setItem('staffToken', tokenToStore)
    } else {
      localStorage.removeItem('staffToken')
    }
  }

  const logout = () => {
    // eslint-disable-next-line no-console
    console.info('AuthProvider: Efetuando logout')
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    })
    localStorage.removeItem('staffUser')
    localStorage.removeItem('staffToken')
    // O redirecionamento para /login já está sendo feito no App.tsx ou onde o logout é chamado
  }

  const value = {
    ...authState,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
