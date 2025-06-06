import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, VStack, Spinner, Text } from '@chakra-ui/react';
import Header from '../components/Header';
import TrackList from '../components/TrackList';
import PersonalityCard from '../components/PersonalityCard';
import useAuth from '../hooks/useAuth';
import { getTopTracks, getUserProfile } from '../utils/spotify';
import { formatTracksForPrompt, generatePersonalityAnalysis } from '../utils/analysis';

function Analysis() {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!token && !authLoading) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user profile and top tracks in parallel
        const [userProfile, topTracks] = await Promise.all([
          getUserProfile(),
          getTopTracks(10)
        ]);
        
        setUser(userProfile);
        setTracks(topTracks);
        
        // Generate analysis
        setAnalyzing(true);
        const tracksText = formatTracksForPrompt(topTracks);
        const personalityAnalysis = await generatePersonalityAnalysis(tracksText);
        setAnalysis(personalityAnalysis);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setAnalyzing(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token, authLoading, navigate]);

  if (authLoading || loading) {
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