import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import SplashScreen from '@/components/SplashScreen'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/sonner'
import { useAuth } from '@/contexts/authContextCore'
import CreateDraftEventPage from '@/pages/events/CreateDraftEventPage'
import CreateEventPage from '@/pages/events/CreateEventPage'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import StaffDashboardPage from '@/pages/StaffDashboardPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'

function App() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  if (auth.initialLoading) {
    return <SplashScreen />
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:opacity-80">
            Check Fácil
          </Link>
          {auth.isAuthenticated ? (
            <nav>
              <ul className="flex items-center space-x-2 md:space-x-4">
                <li>
                  <Button
                    asChild
                    variant="link"
                    className="text-primary-foreground p-0 h-auto text-sm md:text-base"
                  >
                    <Link to="/staff/dashboard">Painel</Link>
                  </Button>
                </li>
                <li>
                  <Button onClick={handleLogout} variant="secondary" size="sm">
                    Sair
                  </Button>
                </li>
              </ul>
            </nav>
          ) : (
            <nav>
              <ul className="flex items-center space-x-2 md:space-x-4">
                <li>
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </header>

      <main className="container mx-auto w-full flex flex-col flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/staff/dashboard"
            element={<ProtectedRoute element={<StaffDashboardPage />} />}
          />
          <Route
            path="staff/events/createEvent"
            element={<ProtectedRoute element={<CreateEventPage />} />}
          />
          <Route
            path="/staff/events/newEventDraft"
            element={<ProtectedRoute element={<CreateDraftEventPage />} />}
          />
        </Routes>
      </main>
      <footer className="p-4 bg-muted text-muted-foreground text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Check Fácil. Todos os direitos reservados.</p>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  )
}
export default App
