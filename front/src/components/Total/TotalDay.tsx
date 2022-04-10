import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataset,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Badge, Box, Flex, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { Consumption } from '../../actions/fetchTodayStats';
import Pricing from './Pricing';
import PricingContext from '../../context/princingContext';
import computeCost from '../../utils/computeCost';

// TODO: move into component
ChartJS.register(
  CategoryScale,
  LineElement,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
);

function computeLabels(consumptions: Consumption[]): string[] {
  const labels: string[] = [];

  consumptions.forEach((consumption) => {
    labels.push(new Date(consumption.CreatedAt).toLocaleTimeString('fr-FR'));
  });

  return labels;
}

function computeData(
  consumptions: Consumption[],
): ChartDataset<'line', number[]>[] {
  const powers = consumptions.map((c) => c.Power);
  const voltages = consumptions.map((c) => c.Voltage);

  const data: ChartDataset<'line', number[]>[] = [
    {
      label: 'Puissance',
      data: powers,
      yAxisID: 'y',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Tension',
      data: voltages,
      yAxisID: 'y1',
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ];

  return data;
}

type TotalDayProps = {
  consumptions: Consumption[];
  hourlyConsumptions: Record<number, number>;
  average: number;
  date: string;
};

export default function TotalDay({
  consumptions,
  hourlyConsumptions,
  average,
  date,
}: TotalDayProps) {
  const pricings = useContext(PricingContext);

  return (
    <Box borderWidth="thin" borderRadius="lg" boxShadow="md">
      <Box py={3} px={6} borderBottomWidth="thin">
        <Text>
          {new Date(date).toLocaleDateString('fr-FR', {
            dateStyle: 'full',
          })}
        </Text>
      </Box>
      <Box p={6}>
        <Box mb={6}>
          <Line
            options={{
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  min: 0,
                  max: 250,
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
            data={{
              labels: computeLabels(consumptions),
              datasets: computeData(consumptions),
            }}
          />
        </Box>
        <Pricing hourlyConsumptions={hourlyConsumptions} pricings={pricings} />
      </Box>
      <Flex py={3} px={6} borderTopWidth="thin" justifyContent="space-between">
        <Text>
          Moyenne consommation :{' '}
          <Badge colorScheme="linkedin">{average} W/h</Badge>
        </Text>
        <Text>
          Coût moyen :{' '}
          <Badge colorScheme="linkedin">
            {computeCost(
              consumptions?.[0]?.DayColor,
              hourlyConsumptions,
              pricings,
            )}{' '}
            €
          </Badge>
        </Text>
      </Flex>
    </Box>
  );
}
