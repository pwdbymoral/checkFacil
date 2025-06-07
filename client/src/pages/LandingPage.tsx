import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const LandingPage = () => {
  return (
    <div className="flex flex-grow flex-col items-center justify-center text-center p-4">
      <h1 className="text-5xl font-bold text-primary mb-4">Check Fácil</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        A forma moderna de gerenciar o acesso e a segurança do seu evento.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg">
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}

export default LandingPage
