import { Box, Heading, SimpleGrid, Image, Text, VStack } from '@chakra-ui/react';

function EnhancedTrackList({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return (
      <Box p={6} borderRadius="lg" boxShadow="md" bg="white" mb={8}>
        <Heading size="md" mb={4}>Your Top Tracks</Heading>
        <Text>No tracks found. Try refreshing or logging in again.</Text>
      </Box>
    );
  }

  return (
    <Box p={6} borderRadius="lg" boxShadow="md" bg="white" mb={8}>
      <Heading size="md" mb={6}>Your Top Tracks</Heading>
      
      <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={4}>
        {tracks.map((track, index) => (
          <VStack key={track.id || index} spacing={2} align="center">
            <Box 
              position="relative" 
              width="100%" 
              paddingBottom="100%" 
              overflow="hidden" 
              borderRadius="md"
            >
              <Image 
                position="absolute"
                top="0"
                left="0"
                width="100%"
                height="100%"
                src={track.album?.images?.[0]?.url || 'https://via.placeholder.com/300'}
                alt={track.name}
                objectFit="cover"
              />
              <Box 
                position="absolute" 
                top="0" 
                left="0" 
                bg="blackAlpha.600" 
                color="white" 
                px={2} 
                py={1} 
                fontSize="sm"
                borderBottomRightRadius="md"
              >
                {index + 1}
              </Box>
            </Box>
            <Text 
              fontWeight="bold" 
              fontSize="sm" 
              noOfLines={1} 
              textAlign="center"
              width="100%"
            >
              {track.name}
            </Text>
            <Text 
              fontSize="xs" 
              color="gray.600" 
              noOfLines={1}
              textAlign="center"
              width="100%"
            >
              {track.artists?.map(artist => artist.name).join(', ')}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default EnhancedTrackList;