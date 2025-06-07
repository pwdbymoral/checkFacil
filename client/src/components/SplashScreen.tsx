import { Loader2 } from 'lucide-react'

const SplashScreen = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <h1 className="text-3xl font-bold text-primary animate-pulse">Check Fácil</h1>
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )
}

export default SplashScreen
