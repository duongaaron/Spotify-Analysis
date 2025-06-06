import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Box>
      <Header />
      <VStack spacing={6} py={10} textAlign="center">
        <Heading>Page Not Found</Heading>
        <Text color="gray.600">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Button 
          onClick={() => navigate('/')}
          colorScheme="gray"
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  );
}

export default NotFound;