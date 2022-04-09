import {
  Box,
  SimpleGrid,
  Text,
  UnorderedList,
  ListItem,
  Badge,
} from '@chakra-ui/react';
import { useContext } from 'react';
import PricingContext from '../../context/princingContext';

export default function Pricing() {
  const pricings = useContext(PricingContext);

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
              Heure pleine : <Badge>{pricings.Red.FullHour} cts</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>{pricings.Red.PeakHour} cts</Badge>
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
              Heure pleine : <Badge>{pricings.White.FullHour} cts</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>{pricings.White.PeakHour} cts</Badge>
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
              Heure pleine : <Badge>{pricings.Blue.FullHour} cts</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>{pricings.Blue.PeakHour} cts</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>Total : xxx €</Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
