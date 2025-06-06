import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, VStack, Button, Code } from '@chakra-ui/react';
import { getCodeFromUrl, useMockData } from '../utils/spotify';

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [authCode, setAuthCode] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      // Check for error in URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlError = urlParams.get('error');
      
      if (urlError) {
        console.error('URL contains error:', urlError);
        setError(`Authentication error: ${urlError}`);
        return;
      }
      
      // Try to get authorization code
      const code = getCodeFromUrl();
      
      if (code) {
        setAuthCode(code);
        console.log('Got authorization code:', code);
        
        // In a real app, you would exchange this code for a token
        // Since we can't do that securely in the frontend, we'll use mock data
        useMockData();
        
        // Wait a moment to show the code before redirecting
        setTimeout(() => {
          navigate('/analysis');
        }, 5000);
      } else {
        setError('No authorization code found. Try the demo version instead.');
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
        {!error && !authCode && <Spinner size="xl" color="spotify.green" thickness="4px" />}
        
        {error ? (
          <Text color="red.500">{error}</Text>
        ) : authCode ? (
          <>
            <Text color="green.500" fontWeight="bold">Authentication successful!</Text>
            <Text>Got authorization code:</Text>
            <Code p={2} borderRadius="md" maxW="100%" overflow="auto">
              {authCode}
            </Code>
            <Text>
              In a real app, this code would be sent to a server to exchange for an access token.
              Redirecting to analysis page in 5 seconds...
            </Text>
          </>
        ) : (
          <Text>Connecting to Spotify...</Text>
        )}
        
        <Button 
          onClick={handleUseMockData}
          mt={4}
          colorScheme="gray"
        >
          {authCode ? "Continue to Analysis" : "Use Demo Version Instead"}
        </Button>
      </VStack>
    </Box>
  );
}

export default Callback;