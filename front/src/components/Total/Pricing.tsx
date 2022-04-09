import {
  Box,
  SimpleGrid,
  Text,
  UnorderedList,
  ListItem,
  Badge,
} from '@chakra-ui/react';

export default function Pricing() {
  return (
    <Box>
      <Text mb={1} fontSize="xl" fontWeight="semibold">
        Coût
      </Text>
      <SimpleGrid columns={3} spacing={6}>
        <Box>
          <Text fontSize="lg" mb={1}>
            Jour rouge
          </Text>
          <UnorderedList>
            <ListItem>
              Heure pleine : <Badge>0.15cts</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>0.15cts</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>Total : xxx €</Text>
        </Box>
        <Box>
          <Text fontSize="lg" mb={1}>
            Jour blanc
          </Text>
          <UnorderedList>
            <ListItem>
              Heure pleine : <Badge>0.15cts</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>0.15cts</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>Total : xxx €</Text>
        </Box>
        <Box>
          <Text fontSize="lg" mb={1}>
            Jour bleu
          </Text>
          <UnorderedList>
            <ListItem>
              Heure pleine : <Badge>0.15cts</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>0.15cts</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>Total : xxx €</Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
