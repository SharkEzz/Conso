import { Box, Container, Flex, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import Tempo from '../Tempo';

export default function Navbar() {
  return (
    <Box
      bg="ButtonFace"
      h="16"
      boxShadow="md"
      mb={6}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Container maxW="container.xl" h="100%">
        <Flex alignItems="center" h="100%" gap={6}>
          <Text fontSize="xl" fontWeight="bold">
            Suivi conso
          </Text>
          <Flex gap={3}>
            <Link to="/">Journée</Link>
            <Link to="/historique">Historique</Link>
          </Flex>
          <Box ml="auto">
            <Tempo />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
