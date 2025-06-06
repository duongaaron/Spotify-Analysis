import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, VStack, Button } from '@chakra-ui/react';
import { exchangeCodeForToken, useMockData } from '../utils/spotify';

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const urlError = urlParams.get('error');
        
        if (urlError) {
          console.error('URL contains error:', urlError);
          setError(`Authentication error: ${urlError}`);
          return;
        }
        
        // Get authorization code from URL parameters
        const code = urlParams.get('code');
        
        if (!code) {
          setError('No authorization code found. Try the demo version instead.');
          return;
        }
        
        // Exchange code for token
        await exchangeCodeForToken(code);
        
        // Make sure we're not using mock data
        localStorage.removeItem('using_mock_data');
        
        // Navigate to analysis page
        navigate('/analysis');
      } catch (error) {
        console.error('Error during authentication:', error);
        setError(`Authentication error: ${error.message}. Try the demo version instead.`);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  const handleUseMockData = () => {
    useMockData();
    navigate('/analysis');
  };

  return (
    <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4} maxW="600px" p={6}>
        {loading && <Spinner size="xl" color="spotify.green" thickness="4px" />}
        
        {error ? (
          <>
            <Text color="red.500">{error}</Text>
            <Button 
              onClick={handleUseMockData}
              mt={4}
              colorScheme="gray"
            >
              Use Demo Version Instead
            </Button>
          </>
        ) : loading ? (
          <Text>Connecting to Spotify...</Text>
        ) : null}
      </VStack>
    </Box>
  );
}

export default Callback;