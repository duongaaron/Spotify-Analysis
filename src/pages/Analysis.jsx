import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, Spinner, Text, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import Header from '../components/Header';
import TrackList from '../components/TrackList';
import PersonalityCard from '../components/PersonalityCard';
import { getTopTracks, getUserProfile } from '../utils/spotify';
import { formatTracksForPrompt, generatePersonalityAnalysis } from '../utils/analysis';

function Analysis() {
  const navigate = useNavigate();
  
  const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user profile and top tracks in parallel
        const [userProfile, userTracks] = await Promise.all([
          getUserProfile(),
          getTopTracks(10)
        ]);
        
        // Set user and tracks
        setUser(userProfile);
        setTracks(userTracks);
        setLoading(false);
        
        // Generate analysis based on the tracks
        setAnalyzing(true);
        
        if (!userTracks || userTracks.length === 0) {
          throw new Error('No tracks found in your Spotify account');
        }
        
        const tracksText = formatTracksForPrompt(userTracks);
        const personalityAnalysis = await generatePersonalityAnalysis(tracksText);
        setAnalysis(personalityAnalysis);
        setAnalyzing(false);
        
      } catch (error) {
        console.error('Error:', error);
        setError(`Error: ${error.message || 'Something went wrong'}`);
        setLoading(false);
        setAnalyzing(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Clear Spotify tokens
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    
    // Navigate back to login
    navigate('/');
  };

  const handleRetry = () => {
    // Reload the page to retry
    window.location.reload();
  };

  if (loading) {
    return (
      <Box height="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="spotify.green" thickness="4px" />
          <Text>Loading your music data...</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box>
      <Header />
      
      {error && (
        <Alert status="error" borderRadius="md" mb={4}>
          <AlertIcon />
          <VStack align="start" spacing={2} width="100%">
            <AlertDescription>{error}</AlertDescription>
            <Button size="sm" onClick={handleRetry} mt={2}>
              Retry
            </Button>
          </VStack>
        </Alert>
      )}
      
      <PersonalityCard 
        analysis={analysis} 
        loading={analyzing} 
        userName={user?.display_name}
      />
      
      <TrackList tracks={tracks} />
      
      <Box textAlign="center" mt={8}>
        <Button
          onClick={handleLogout}
          variant="outline"
          colorScheme="gray"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

export default Analysis;