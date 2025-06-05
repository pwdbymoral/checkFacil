import './App.css'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/authContextCore'
import LoginPage from '@/pages/LoginPage'
import StaffDashboardPage from '@/pages/StaffDashboardPage'
import { ProtectedRoute } from '@/router/ProtectedRoute'

function HomePagePlaceholder() {
  return (
    <div>
      <h1>Bem-vindo(a) ao Check Fácil!</h1>
      <p>Esta é a página inicial (placeholder).</p>
      <nav>
        <p>Navegue para:</p>
        <Button asChild>
          <Link to="/login">Ir para Login do Staff</Link>
        </Button>
      </nav>
    </div>
  )
}

function App() {
  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <nav>
            <ul className="flex items-center flex-wrap space-x-2 md:space-x-4">
              <Link to="/" className="text-xl font-bold hover:opacity-80">
                Check Fácil
              </Link>
              <li>
                <Button
                  asChild
                  variant="link"
                  className="text-primary-foreground p-0 h-auto text-sm md:text-base"
                >
                  <Link to="/" className="text-sm md:text-base">
                    Home
                  </Link>
                </Button>
              </li>
              {auth.isAuthenticated ? (
                <>
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
                </>
              ) : (
                <li>
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/login">Login</Link>
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-6 mb-6 flex-grow">
        <Routes>
          <Route path="/" element={<HomePagePlaceholder />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/staff/dashboard"
            element={<ProtectedRoute element={<StaffDashboardPage />} />}
          />
        </Routes>
      </main>
      <footer className="p-4 bg-muted text-muted-foreground text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Check Fácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
export default App
