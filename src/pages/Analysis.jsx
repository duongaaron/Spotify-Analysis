import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, Spinner, Text } from '@chakra-ui/react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if we're using mock data
        const usingMockData = localStorage.getItem('using_mock_data') === 'true';
        
        if (usingMockData) {
          // Use mock data
          setUser(mockUser);
          setTracks(mockTracks);
        } else {
          // Try to use real Spotify data
          try {
            // Get user profile and top tracks in parallel
            const [userProfile, topTracks] = await Promise.all([
              getUserProfile(),
              getTopTracks(10)
            ]);
            
            setUser(userProfile);
            setTracks(topTracks);
          } catch (spotifyError) {
            console.error('Error fetching Spotify data:', spotifyError);
            setError('Failed to fetch your Spotify data. Using demo data instead.');
            
            // Fall back to mock data
            setUser(mockUser);
            setTracks(mockTracks);
          }
        }
        
        // Generate analysis
        setAnalyzing(true);
        const tracksToAnalyze = usingMockData ? mockTracks : tracks;
        const tracksText = formatTracksForPrompt(tracksToAnalyze);
        const personalityAnalysis = await generatePersonalityAnalysis(tracksText);
        setAnalysis(personalityAnalysis);
        
      } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
        setAnalyzing(false);
      }
    };

    fetchData();
  }, []);

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
        <Box bg="red.50" p={4} borderRadius="md" mb={4}>
          <Text color="red.500">{error}</Text>
        </Box>
      )}
      
      <PersonalityCard 
        analysis={analysis} 
        loading={analyzing} 
        userName={user?.display_name}
      />
      
      <TrackList tracks={tracks} />
      
      <Box textAlign="center" mt={8}>
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          colorScheme="gray"
        >
          Start Over
        </Button>
      </Box>
    </Box>
  );
}

export default Analysis;