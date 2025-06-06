import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, Heading, Text, Image, HStack, Divider } from '@chakra-ui/react';
import { getLoginUrl } from '../utils/spotify';
import Header from '../components/Header';

function Login() {
  const navigate = useNavigate();

  const handleSpotifyLogin = () => {
    // Redirect to Spotify authorization
    window.location.href = getLoginUrl();
  };

  const handleDemoLogin = () => {
    // Use mock data instead
    localStorage.setItem('using_mock_data', 'true');
    navigate('/analysis');
  };

  return (
    <Box>
      <Header />
      <VStack spacing={8} py={10} textAlign="center">
        <Image src="/music-note.svg" alt="Logo" boxSize="80px" />
        
        <VStack spacing={3}>
          <Heading>Discover Your Music Personality</Heading>
          <Text color="gray.600" maxW="md">
            Get a fun AI-generated personality analysis based on your music taste.
          </Text>
        </VStack>
        
        <VStack spacing={6} width="100%" maxW="md">
          <Button
            onClick={handleSpotifyLogin}
            bg="spotify.green"
            color="white"
            size="lg"
            width="100%"
            _hover={{ bg: 'green.600' }}
          >
            Connect with Spotify
          </Button>
          
          <HStack width="100%">
            <Divider />
            <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">or</Text>
            <Divider />
          </HStack>
          
          <Button
            onClick={handleDemoLogin}
            variant="outline"
            colorScheme="gray"
            size="lg"
            width="100%"
          >
            Try Demo Version
          </Button>
        </VStack>
        
        <Text fontSize="sm" color="gray.500">
          We only access your top tracks to create your personality analysis.
        </Text>
      </VStack>
    </Box>
  );
}

export default Login;