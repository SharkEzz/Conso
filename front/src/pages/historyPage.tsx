import { Box, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import fetchHistoryStats from '../actions/fetchHistoryStats';
import TotalDay from '../components/Total/TotalDay';
import FiltersDrawer from '../components/UI/FiltersDrawer';

export default function HistoryPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [stopDate, setStopDate] = useState<Date | null>(null);
  const { data, isLoading, isError, refetch } = useQuery(
    'historyStats',
    async () => fetchHistoryStats(startDate, stopDate),
  );

  useEffect(() => {
    refetch();
  }, [startDate, stopDate, refetch]);

  const handleSubmitFilters = (start: Date | null, stop: Date | null) => {
    setStartDate(start);
    setStopDate(stop);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if ((!isLoading && !data) || !data || isError) {
    return <p>Une erreur est survenue</p>;
  }

  return (
    <>
      <Box textAlign="right" mb={6}>
        <FiltersDrawer handleValid={handleSubmitFilters} />
      </Box>
      {Object.keys(data).map((day) => (
        <TotalDay key={day} stats={data[day as any]} />
      ))}
    </>
  );
}
