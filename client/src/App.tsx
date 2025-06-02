import './App.css'
import { Routes, Route, Link } from 'react-router-dom'

import { Button } from './components/ui/button'
import LoginPage from './pages/LoginPage'

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
  return (
    <div>
      <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}>
        <nav>
          <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', padding: 0 }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login do Staff</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePagePlaceholder />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <footer
        style={{
          padding: '1rem',
          backgroundColor: '#f0f0f0',
          marginTop: '1rem',
          textAlign: 'center',
        }}
      >
        <p>&copy; {new Date().getFullYear()} Check Fácil. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
export default App
