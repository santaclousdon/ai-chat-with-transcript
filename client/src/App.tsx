import { useEffect, useState } from 'react'
import { Button, HStack } from '@chakra-ui/react'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/')
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </div>
  )
}

export default App
