import { Box, Text, VStack, Heading, Spinner } from '@chakra-ui/react';

function PersonalityCard({ analysis, loading, userName }) {
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
        
        {loading ? (
          <Box textAlign="center" py={4}>
            <Spinner color="spotify.green" size="lg" />
            <Text mt={2}>Analyzing your music taste...</Text>
          </Box>
        ) : (
          <>
            {userName && (
              <Text fontWeight="bold" fontSize="lg">
                Hey {userName}!
              </Text>
            )}
            <Text fontSize="lg" fontStyle="italic">
              "{analysis}"
            </Text>
          </>
        )}
      </VStack>
    </Box>
  );
}

export default PersonalityCard;