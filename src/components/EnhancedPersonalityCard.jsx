import { Box, Heading, Text, VStack, Spinner } from '@chakra-ui/react';

function EnhancedPersonalityCard({ analysisData, loading, userName }) {
  // Handle loading state
  if (loading) {
    return (
      <Box p={6} borderRadius="lg" boxShadow="md" bg="white" mb={8} textAlign="center" minHeight="300px" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="spotify.green" thickness="4px" />
          <Text>Analyzing your music personality...</Text>
        </VStack>
      </Box>
    );
  }

  // Handle empty data
  if (!analysisData) {
    return (
      <Box p={6} borderRadius="lg" boxShadow="md" bg="white" mb={8}>
        <Heading size="md" mb={4}>Your Music Personality</Heading>
        <Text>Hey {userName || 'there'}!!</Text>
        <Text mt={4}>We couldn't generate your personality analysis. Please try again later.</Text>
      </Box>
    );
  }

  // Extract the text content regardless of format
  let displayText = "";
  
  try {
    if (typeof analysisData === 'string') {
      // Try to parse as JSON if it looks like JSON
      if (analysisData.trim().startsWith('{') && analysisData.trim().endsWith('}')) {
        const parsed = JSON.parse(analysisData);
        displayText = parsed.personality_analysis || parsed.analysis || JSON.stringify(parsed);
      } else {
        // Just use the string directly
        displayText = analysisData;
      }
    } else if (typeof analysisData === 'object' && analysisData !== null) {
      // Extract from object
      displayText = analysisData.personality_analysis || analysisData.analysis || JSON.stringify(analysisData);
    } else {
      // Fallback
      displayText = String(analysisData);
    }
  } catch (e) {
    console.error('Error processing analysis data:', e);
    displayText = String(analysisData);
  }

  return (
    <Box p={6} borderRadius="lg" boxShadow="md" bg="white" mb={8}>
      <Heading size="md" mb={4}>Your Music Personality</Heading>
      <Text mb={4}>Hey {userName || 'there'}!!</Text>
      <Text whiteSpace="pre-wrap">{displayText}</Text>
    </Box>
  );
}

export default EnhancedPersonalityCard;
