import { Box, Input, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useQuery } from 'react-query';
import fetchHistoryStats from '../actions/fetchHistoryStats';
import TotalDay from '../components/TotalDay/TotalDay';

const currentDate = new Date();

export default function HistoryPage() {
  const [startDate, setStartDate] = useState<Date | null>(currentDate);
  const [stopDate, setStopDate] = useState<Date | null>(
    new Date(new Date().setDate(currentDate.getDate() + 1)),
  );
  const { data, isLoading, isError, refetch } = useQuery(
    'historyStats',
    async () => fetchHistoryStats(startDate, stopDate),
  );

  useEffect(() => {
    refetch();
  }, [startDate, stopDate, refetch]);

  if (isLoading) {
    return <Spinner />;
  }

  if ((!isLoading && !data) || !data || isError) {
    return <p>Une erreur est survenue</p>;
  }

  return (
    <>
      <Box mb={6}>
        <Box w="xs" ml="auto">
          <ReactDatePicker
            selected={startDate}
            onChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setStopDate(end);
            }}
            customInput={<Input textAlign="center" />}
            startDate={startDate}
            endDate={stopDate}
            maxDate={new Date()}
            selectsRange
            dateFormat="dd/MM/yyyy"
          />
        </Box>
      </Box>
      {Object.keys(data).map((day) => (
        <TotalDay key={day} stats={data[day as any]} />
      ))}
    </>
  );
}
