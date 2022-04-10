import { Box } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import fetchHistoryStats from '../actions/fetchHistoryStats';
import FiltersDrawer from '../components/UI/FiltersDrawer';

export default function HistoryPage() {
  const { data, isLoading, isError } = useQuery(
    'historyStats',
    fetchHistoryStats,
  );

  console.log(data, isLoading, isError);

  return (
    <Box textAlign="right" mb={6}>
      <FiltersDrawer />
    </Box>
  );
}
