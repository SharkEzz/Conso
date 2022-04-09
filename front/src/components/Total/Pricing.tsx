import {
  Box,
  SimpleGrid,
  Text,
  UnorderedList,
  ListItem,
  Badge,
} from '@chakra-ui/react';
import { useContext } from 'react';
import { Pricings } from '../../actions/fetchPricing';
import PricingContext from '../../context/princingContext';

function computeCost(
  tempo: string,
  hourConsumption: Record<number, number>,
  pricings: Pricings,
): number {
  const hours = Object.keys(hourConsumption).map((h) => Number(h));

  let cost = 0;
  hours.forEach((h) => {
    switch (tempo) {
      case 'TEMPO_ROUGE':
        if (h >= 6 && h < 14) {
          cost += (hourConsumption[h] / 1000) * pricings.Red.FullHour;
        } else {
          cost += (hourConsumption[h] / 1000) * pricings.Red.PeakHour;
        }
        break;
      case 'TEMPO_BLANC':
        if (h >= 6 && h < 14) {
          cost += (hourConsumption[h] / 1000) * pricings.White.FullHour;
        } else {
          cost += (hourConsumption[h] / 1000) * pricings.White.PeakHour;
        }
        break;
      case 'TEMPO_BLEU':
        if (h >= 6 && h < 14) {
          cost += (hourConsumption[h] / 1000) * pricings.Blue.FullHour;
        } else {
          cost += (hourConsumption[h] / 1000) * pricings.Blue.PeakHour;
        }
        break;
      default:
        break;
    }
  });

  return Math.round((cost + Number.EPSILON) * 10000) / 10000;
}

export default function Pricing({
  hourlyConsumptions,
}: {
  hourlyConsumptions: Record<number, number>;
}) {
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
