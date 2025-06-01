import { useState } from 'react'

import './App.css'
import { Button } from './components/ui/button'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Button variant="link">Link</Button> <br />
      <Button variant="default">Default</Button> <br />
      <Button variant="destructive">Destructive</Button>
    </>
  )
}

export default App
