import { Box, Heading, Flex, Button, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const isAnalysisPage = window.location.pathname === '/analysis';

  return (
    <Flex as="header" width="full" align="center" justifyContent="space-between" py={4} mb={8}>
      <Flex align="center" cursor="pointer" onClick={() => navigate('/')}>
        <Image src="/music-note.svg" alt="Logo" boxSize="30px" mr={2} />
        <Heading size="md" color="spotify.black">Spotify Personality Analyzer</Heading>
      </Flex>
      
      {isAnalysisPage && (
        <Button 
          size="sm" 
          onClick={() => navigate('/')}
          colorScheme="gray"
        >
          Back
        </Button>
      )}
    </Flex>
  );
}

export default Header;