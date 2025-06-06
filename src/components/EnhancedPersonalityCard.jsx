import { Box, Text, VStack, Heading, Spinner, Divider, Badge } from '@chakra-ui/react';

function EnhancedPersonalityCard({ analysisData, loading, userName }) {
  // If we're still loading or don't have analysis data
  if (loading) {
    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={6} 
        bg="white" 
        shadow="md"
        borderColor="spotify.green"
        borderLeftWidth="4px"
        my={6}
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md">Your Music Personality</Heading>
          <Box textAlign="center" py={4}>
            <Spinner color="spotify.green" size="lg" />
            <Text mt={2}>Analyzing your music taste...</Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  // If we don't have any analysis data
  if (!analysisData) {
    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={6} 
        bg="white" 
        shadow="md"
        borderColor="spotify.green"
        borderLeftWidth="4px"
        my={6}
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md">Your Music Personality</Heading>
          <Text>No analysis data available.</Text>
        </VStack>
      </Box>
    );
  }

  // Get the personality analysis text
  let personalityAnalysisText = '';
  if (typeof analysisData === 'string') {
    personalityAnalysisText = analysisData;
  } else if (analysisData.personality_analysis) {
    personalityAnalysisText = analysisData.personality_analysis;
  }

  // Parse the sections from the text
  const profileMatch = personalityAnalysisText.match(/1\.\s*Personality\s*Profile:([\s\S]*?)(?=2\.\s*Key\s*Personality\s*Traits:)/i);
  const traitsMatch = personalityAnalysisText.match(/2\.\s*Key\s*Personality\s*Traits:([\s\S]*?)(?=3\.\s*Music\s*Taste\s*Analysis:)/i);
  const musicMatch = personalityAnalysisText.match(/3\.\s*Music\s*Taste\s*Analysis:([\s\S]*?)(?=4\.\s*Fun,\s*Creative\s*Title)/i);
  const titleMatch = personalityAnalysisText.match(/4\.\s*Fun,\s*Creative\s*Title[^:]*:([\s\S]*)/i);

  // Extract the content
  const personalityProfile = profileMatch ? profileMatch[1].trim() : '';
  const traitsSection = traitsMatch ? traitsMatch[1].trim() : '';
  const musicTasteAnalysis = musicMatch ? musicMatch[1].trim() : '';
  const personalityTitle = titleMatch ? 
    titleMatch[1].trim().replace(/^"(.+)"$/, '$1').replace(/^"(.+)"$/, '$1') : 
    "Your Music Personality";

  // Parse traits into an array
  const traits = traitsSection
    .split('-')
    .map(trait => trait.trim())
    .filter(trait => trait.length > 0);

  // Format paragraphs with proper spacing
  const formatParagraphs = (text) => {
    return text.split('\n\n').map((paragraph, i) => (
      <Text key={i} mb={4}>{paragraph}</Text>
    ));
  };

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={6} 
      bg="white" 
      shadow="md"
      borderColor="spotify.green"
      borderLeftWidth="4px"
      my={6}
    >
      <VStack spacing={6} align="stretch">
        <Heading size="md" textAlign="center" color="spotify.green">
          {personalityTitle}
        </Heading>
        
        {userName && (
          <Text fontWeight="bold" fontSize="lg">
            Hey {userName}!
          </Text>
        )}
        
        <Box>
          <Heading size="sm" mb={3}>Personality Profile</Heading>
          {formatParagraphs(personalityProfile)}
        </Box>
        
        <Divider />
        
        <Box>
          <Heading size="sm" mb={3}>Key Personality Traits</Heading>
          <Box display="flex" flexWrap="wrap" gap={2}>
            {traits.map((trait, index) => (
              <Badge key={index} colorScheme="green" fontSize="0.9em" px={2} py={1} borderRadius="full">
                {trait}
              </Badge>
            ))}
          </Box>
        </Box>
        
        <Divider />
        
        <Box>
          <Heading size="sm" mb={3}>Music Taste Analysis</Heading>
          {formatParagraphs(musicTasteAnalysis)}
        </Box>
      </VStack>
    </Box>
  );
}

export default EnhancedPersonalityCard;
