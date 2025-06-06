import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Spinner, Text, VStack, Button, Code } from '@chakra-ui/react';
import { useMockData } from '../utils/spotify';

function Callback() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [authCode, setAuthCode] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const handleCallback = async () => {
      // Collect debug information
      const debug = {
        fullUrl: window.location.href,
        search: window.location.search,
        hash: window.location.hash,
        urlParams: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
        hashParams: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1)).entries())
      };
      
      setDebugInfo(debug);
      console.log('Debug info:', debug);
      
      // Check for error in URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const urlError = urlParams.get('error');
      
      if (urlError) {
        console.error('URL contains error:', urlError);
        setError(`Authentication error: ${urlError}`);
        return;
      }
      
      // Check for error in hash fragment
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const hashError = hashParams.get('error');
      
      if (hashError) {
        console.error('Hash contains error:', hashError);
        setError(`Authentication error: ${hashError}`);
        return;
      }
      
      // Try to get authorization code from URL parameters
      const code = urlParams.get('code');
      
      // Try to get access token from hash fragment (for implicit flow)
      const token = hashParams.get('access_token');
      
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
      } else if (token) {
        console.log('Got access token directly:', token);
        setAuthCode('Using implicit flow - token received directly');
        
        // In a real app, you would use this token directly
        // For demo purposes, we'll use mock data
        useMockData();
        
        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/analysis');
        }, 5000);
      } else {
        setError('No authorization code or token found. Try the demo version instead.');
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
          <>
            <Text color="red.500">{error}</Text>
            <Text fontSize="sm">Debug information:</Text>
            <Code p={2} borderRadius="md" maxW="100%" overflow="auto" fontSize="xs">
              {JSON.stringify(debugInfo, null, 2)}
            </Code>
          </>
        ) : authCode ? (
          <>
            <Text color="green.500" fontWeight="bold">Authentication successful!</Text>
            <Text>Authentication data received:</Text>
            <Code p={2} borderRadius="md" maxW="100%" overflow="auto">
              {authCode}
            </Code>
            <Text>
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