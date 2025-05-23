import { useEffect, useState } from 'react'
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react'

interface User {
  id: number;
  name: string;
  email: string;
}

function App() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + '/users')
      .then((res) => res.json())
      .then(setUsers)
  }, [])

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6}>
        <Heading as="h1" size="xl">Blueprint AI Work Simulation Exercise</Heading>
        <VStack gap={4} width="100%">
          {users.map((user) => (
            <Box
              key={user.id}
              border="1px solid"
              borderColor="black"
              borderRadius="md"
              p={4}
              width="100%"
              transition="all 0.2s"
              _hover={{
                transform: 'translateX(4px)',
                boxShadow: 'md',
                borderColor: 'blue.500',
                cursor: 'pointer'
              }}
            >
              <Text fontWeight="bold" fontSize="lg">ID: {user.id}</Text>
              <Text fontSize="md">Name: {user.name}</Text>
              <Text color="gray.600">Email: {user.email}</Text>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  )
}

export default App
