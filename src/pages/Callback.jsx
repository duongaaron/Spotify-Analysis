import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import { getTokenFromUrl, setAccessToken } from '../utils/spotify';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = () => {
      const token = getTokenFromUrl();
      
      if (token) {
        setAccessToken(token);
        navigate('/analysis');
      } else {
        // Handle authentication error
        navigate('/?error=authentication_failed');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Spinner size="xl" color="spotify.green" thickness="4px" />
        <Text>Connecting to Spotify...</Text>
      </VStack>
    </Box>
  );
}

export default Callback;