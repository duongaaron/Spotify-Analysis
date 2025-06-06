import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, Heading, Text, Image } from '@chakra-ui/react';
import { getLoginUrl } from '../utils/spotify';
import useAuth from '../hooks/useAuth';
import Header from '../components/Header';

function Login() {
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token && !loading) {
      navigate('/analysis');
    }
  }, [token, loading, navigate]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  return (
    <Box>
      <Header />
      <VStack spacing={8} py={10} textAlign="center">
        <Image src="/music-note.svg" alt="Logo" boxSize="80px" />
        
        <VStack spacing={3}>
          <Heading>Discover Your Music Personality</Heading>
          <Text color="gray.600" maxW="md">
            Connect your Spotify account to get a fun AI-generated personality analysis based on your music taste.
          </Text>
        </VStack>
        
        <Button
          onClick={handleLogin}
          bg="spotify.green"
          color="white"
          size="lg"
          _hover={{ bg: 'green.600' }}
          px={8}
          isLoading={loading}
        >
          Connect with Spotify
        </Button>
        
        <Text fontSize="sm" color="gray.500">
          We only access your top tracks to create your personality analysis.
        </Text>
      </VStack>
    </Box>
  );
}

export default Login;