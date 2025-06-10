import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth, type UserRole } from '@/contexts/authContextCore'

interface ProtectedRouteProps {
  element: React.ReactElement
  allowedRoles: UserRole[]
}

export function ProtectedRoute({ element, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()

  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!user || !allowedRoles.includes(user.userType)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />
  }

  return element
}
