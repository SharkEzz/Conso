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
import { Consumption, StatsResponse } from '../../actions/fetchTodayStats';

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

function computeData(consumptions: Consumption[]) {
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

export default function TotalDay({ stats }: { stats: StatsResponse }) {
  return (
    <Box borderWidth="thin" borderRadius="lg" boxShadow="md" mb={6}>
      <Box py={3} px={6} borderBottomWidth="thin">
        <Text>
          {new Date(stats.TodayDate).toLocaleDateString('fr-FR', {
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
                  min: 220,
                  max: 250,
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
            data={{
              labels: computeLabels(stats.Consumptions),
              datasets: computeData(stats.Consumptions),
            }}
          />
        </Box>
      </Box>
      <Flex py={3} px={6} borderTopWidth="thin" justifyContent="space-between">
        <Text>
          Moyenne consommation :{' '}
          <Badge colorScheme="linkedin">
            {Math.round(stats.TotalAverage * 1000) / 1000} W/h
          </Badge>
        </Text>
        <Text>
          Coût : <Badge colorScheme="linkedin">{stats.TotalCost} €</Badge>
        </Text>
      </Flex>
    </Box>
  );
}
