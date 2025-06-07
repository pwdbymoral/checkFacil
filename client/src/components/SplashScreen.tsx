import { Loader2 } from 'lucide-react'

const SplashScreen = () => {
  return (
    <div className="flex h-screen w-full font-bold text-3xl flex-col items-center justify-center bg-primary gap-4">
      <h1 className="text-3xl font-bold text-secondary animate-pulse">Check Fácil</h1>
      <div className="animate-pulse">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      </div>
    </div>
  )
}

export default SplashScreen
