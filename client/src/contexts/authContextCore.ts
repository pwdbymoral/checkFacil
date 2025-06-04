import { createContext, useContext } from 'react'

export interface StaffUser {
  id: string
  email: string
  name?: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: StaffUser | null
  token?: string | null
}

export interface AuthContextType extends AuthState {
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
