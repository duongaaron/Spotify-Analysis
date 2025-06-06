import { Box, Text, VStack, Heading, Spinner } from '@chakra-ui/react';

function SimplePersonalityDisplay({ analysisData, loading, userName }) {
  if (loading) {
    return (
      <Box p={6} bg="white" shadow="md" borderRadius="lg" my={6}>
        <VStack spacing={4}>
          <Spinner color="spotify.green" size="lg" />
          <Text>Analyzing your music taste...</Text>
        </VStack>
      </Box>
    );
  }

  if (!analysisData) {
    return (
      <Box p={6} bg="white" shadow="md" borderRadius="lg" my={6}>
        <Text>No analysis data available.</Text>
      </Box>
    );
  }

  // Get the personality analysis text
  let analysisText = '';
  if (typeof analysisData === 'string') {
    analysisText = analysisData;
  } else if (analysisData.personality_analysis) {
    analysisText = analysisData.personality_analysis;
  } else {
    analysisText = JSON.stringify(analysisData);
  }

  return (
    <Box p={6} bg="white" shadow="md" borderRadius="lg" my={6}>
      <VStack spacing={4} align="stretch">
        <Heading size="md">Your Music Personality</Heading>
        
        {userName && (
          <Text fontWeight="bold">
            Hey {userName}!
          </Text>
        )}
        
        <Box 
          p={4} 
          borderWidth="1px" 
          borderRadius="md" 
          bg="gray.50"
          whiteSpace="pre-wrap"
          fontSize="sm"
        >
          {analysisText}
        </Box>
      </VStack>
    </Box>
  );
}

export default SimplePersonalityDisplay;
