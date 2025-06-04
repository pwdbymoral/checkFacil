import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../contexts/authContextCore'

interface ProtectedRouteProps {
  element: React.ReactElement
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return element
}
