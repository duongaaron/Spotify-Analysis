import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, Spinner, Text, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import Header from '../components/Header';
import TrackList from '../components/TrackList';
import PersonalityCard from '../components/PersonalityCard';
import { getTopTracks, getUserProfile } from '../utils/spotify';
import { formatTracksForPrompt, generatePersonalityAnalysis } from '../utils/analysis';
import { mockUser, mockTracks } from '../utils/mockData';

function Analysis() {
  const navigate = useNavigate();
  
  const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if we're using mock data
        const useMock = localStorage.getItem('using_mock_data') === 'true';
        setUsingMockData(useMock);
        
        let userProfile;
        let userTracks;
        
        if (useMock) {
          // Use mock data
          userProfile = mockUser;
          userTracks = mockTracks;
        } else {
          // Use real Spotify data
          try {
            // Get user profile and top tracks in parallel
            const results = await Promise.all([
              getUserProfile(),
              getTopTracks(10)
            ]);
            
            userProfile = results[0];
            userTracks = results[1];
          } catch (spotifyError) {
            console.error('Error fetching Spotify data:', spotifyError);
            setError('Failed to fetch your Spotify data. Using demo data instead.');
            
            // Fall back to mock data
            userProfile = mockUser;
            userTracks = mockTracks;
            setUsingMockData(true);
          }
        }
        
        // Set user and tracks
        setUser(userProfile);
        setTracks(userTracks);
        setLoading(false);
        
        // Generate analysis based on the tracks
        setAnalyzing(true);
        const tracksText = formatTracksForPrompt(userTracks);
        const personalityAnalysis = await generatePersonalityAnalysis(tracksText);
        setAnalysis(personalityAnalysis);
        setAnalyzing(false);
        
      } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong. Please try again.');
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
    localStorage.removeItem('using_mock_data');
    
    // Navigate back to login
    navigate('/');
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
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {usingMockData && !error && (
        <Alert status="info" borderRadius="md" mb={4}>
          <AlertIcon />
          <AlertDescription>
            Using demo data. To see your real Spotify data, please log in again.
          </AlertDescription>
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