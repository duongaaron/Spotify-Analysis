import { Box, VStack, HStack, Text, Image, Divider, Heading } from '@chakra-ui/react';

function EnhancedTrackList({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return <Text>No tracks found</Text>;
  }

  // Check if we're getting the simplified track format from the API response
  const isSimplifiedFormat = tracks[0] && 'artist' in tracks[0];

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      p={6} 
      bg="white" 
      shadow="md"
      my={6}
    >
      <Heading size="md" mb={4}>Your Top Tracks</Heading>
      <VStack spacing={2} align="stretch">
        {isSimplifiedFormat ? (
          // Render simplified track format from API
          tracks.slice(0, 20).map((track, index) => (
            <Box key={index}>
              <HStack spacing={3} py={2}>
                <Text color="gray.500" fontWeight="bold" minW="20px">{index + 1}</Text>
                <Box>
                  <Text fontWeight="semibold" noOfLines={1}>{track.name}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {track.artist} • {track.album}
                  </Text>
                </Box>
                <Text ml="auto" fontSize="sm" color="gray.400">
                  Popularity: {track.popularity}
                </Text>
              </HStack>
              {index < Math.min(tracks.length - 1, 19) && <Divider />}
            </Box>
          ))
        ) : (
          // Render full Spotify API track format
          tracks.map((track, index) => (
            <Box key={track.id || index}>
              <HStack spacing={3} py={2}>
                <Text color="gray.500" fontWeight="bold" minW="20px">{index + 1}</Text>
                {track.album?.images?.[2] && (
                  <Image 
                    src={track.album.images[2].url} 
                    alt={track.album.name}
                    boxSize="40px"
                    borderRadius="md"
                  />
                )}
                <Box>
                  <Text fontWeight="semibold" noOfLines={1}>{track.name}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={1}>
                    {track.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                  </Text>
                </Box>
              </HStack>
              {index < tracks.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
}

export default EnhancedTrackList;
