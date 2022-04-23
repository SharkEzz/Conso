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
import { StatsResponse } from '../../actions/fetchTodayStats';

// TODO: move into component
ChartJS.register(
  CategoryScale,
  LineElement,
  Legend,
  LinearScale,
  PointElement,
  Tooltip,
);

function computeLabels(stats: StatsResponse[]): string[] {
  const labels: string[] = [];

  stats.forEach((stat) => {
    labels.push(new Date(stat.TodayDate).toLocaleDateString('fr-FR'));
  });

  return labels;
}

function computeData(stats: StatsResponse[]) {
  const power: Array<number> = [];
  const voltage: Array<number> = [];

  stats.forEach((stat) => {
    power.push(stat.TotalAverage);
    const meanVoltage =
      stat.Consumptions.map((item) => item.Voltage).reduce(
        (prev, curr) => Number(prev) + Number(curr),
        0,
      ) / stat.Consumptions.length;
    voltage.push(meanVoltage);
  });

  const data: ChartDataset<'line', number[]>[] = [
    {
      label: 'Puissance',
      data: power,
      yAxisID: 'y',
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Tension',
      data: voltage,
      yAxisID: 'y1',
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ];

  return data;
}

export default function TotalDays({ stats }: { stats: StatsResponse[] }) {
  if (stats.length === 0) {
    return <div>No data</div>;
  }

  return (
    <Box borderWidth="thin" borderRadius="lg" boxShadow="md" mb={6}>
      <Box py={3} px={6} borderBottomWidth="thin">
        <Text>
          <strong>
            {new Date(stats[0]?.TodayDate).toLocaleDateString('fr-FR', {
              dateStyle: 'full',
            })}
          </strong>
          {' -> '}
          <strong>
            {new Date(stats[stats.length - 1]?.TodayDate).toLocaleDateString(
              'fr-FR',
              {
                dateStyle: 'full',
              },
            )}
          </strong>
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
              labels: computeLabels(stats),
              datasets: computeData(stats),
            }}
          />
        </Box>
      </Box>
      <Flex py={3} px={6} borderTopWidth="thin" justifyContent="space-between">
        <Text>
          Consommation moyenne :{' '}
          <Badge colorScheme="linkedin">
            {Math.round(
              (stats
                .map((stat) => stat.TotalAverage)
                .reduce((prev, curr) => prev + curr) /
                stats.length) *
                1000,
            ) / 1000}{' '}
            W/h
          </Badge>
        </Text>
        <Text>
          Consommation totale :{' '}
          <Badge colorScheme="linkedin">
            {Math.round(
              stats
                .map((stat) => stat.TotalAverage)
                .reduce((prev, curr) => prev + curr) * 1000,
            ) / 1000}{' '}
            W
          </Badge>
        </Text>
        {/* <Text>
          Coût total : <Badge colorScheme="linkedin">oui €</Badge>
        </Text> */}
      </Flex>
    </Box>
  );
}
