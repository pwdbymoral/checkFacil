import { createContext, useContext } from 'react'

export const USER_ROLES = ['Adm_espaco', 'Adm_festa'] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  userType: UserRole
}

export interface AuthState {
  isAuthenticated: boolean
  user: AuthenticatedUser | null
  token?: string | null
}

export interface AuthContextType extends AuthState {
  initialLoading: boolean
  login: (userData: AuthenticatedUser, token?: string) => void
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
