import { Box, VStack, HStack, Text, Image, Divider } from '@chakra-ui/react';

function TrackList({ tracks }) {
  if (!tracks || tracks.length === 0) {
    return <Text>No tracks found</Text>;
  }

  return (
    <VStack spacing={2} align="stretch" my={4}>
      <Text fontWeight="bold" mb={2}>Your Top Tracks:</Text>
      {tracks.map((track, index) => (
        <Box key={track.id}>
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
                {track.artists.map(artist => artist.name).join(', ')}
              </Text>
            </Box>
          </HStack>
          {index < tracks.length - 1 && <Divider />}
        </Box>
      ))}
    </VStack>
  );
}

export default TrackList;