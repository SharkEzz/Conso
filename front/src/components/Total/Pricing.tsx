import {
  Box,
  SimpleGrid,
  Text,
  UnorderedList,
  ListItem,
  Badge,
} from '@chakra-ui/react';
import { Pricings } from '../../actions/fetchPricing';
import computeCost from '../../utils/computeCost';

export default function Pricing({
  hourlyConsumptions,
  pricings,
}: {
  hourlyConsumptions: Record<number, number>;
  pricings: Pricings;
}) {
  return (
    <Box>
      <Text mb={1} fontSize="xl" fontWeight="semibold">
        Coût
      </Text>
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        <Box>
          <Text fontSize="lg" mb={1}>
            Jour rouge
          </Text>
          <UnorderedList>
            <ListItem>
              Heure pleine : <Badge>{pricings.Red.FullHour} cts / kWh</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>{pricings.Red.PeakHour} cts / kWh</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>
            Total :{' '}
            <Badge>
              {computeCost('TEMPO_ROUGE', hourlyConsumptions, pricings)} €
            </Badge>
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" mb={1}>
            Jour blanc
          </Text>
          <UnorderedList>
            <ListItem>
              Heure pleine : <Badge>{pricings.White.FullHour} cts / kWh</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>{pricings.White.PeakHour} cts / kWh</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>
            Total :{' '}
            <Badge>
              {computeCost('TEMPO_BLANC', hourlyConsumptions, pricings)} €
            </Badge>
          </Text>
        </Box>
        <Box>
          <Text fontSize="lg" mb={1}>
            Jour bleu
          </Text>
          <UnorderedList>
            <ListItem>
              Heure pleine : <Badge>{pricings.Blue.FullHour} cts / kWh</Badge>
            </ListItem>
            <ListItem>
              Heure creuse : <Badge>{pricings.Blue.PeakHour} cts / kWh</Badge>
            </ListItem>
          </UnorderedList>
          <Text mt={3}>
            Total :{' '}
            <Badge>
              {' '}
              {computeCost('TEMPO_BLEU', hourlyConsumptions, pricings)} €
            </Badge>
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
