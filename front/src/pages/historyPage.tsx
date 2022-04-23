import { Box, Flex, Input, Spinner, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useQuery } from 'react-query';
import fetchHistoryStats from '../actions/fetchHistoryStats';
import TotalDays from '../components/TotalDays/TotalDays';

const currentDate = new Date();

export default function HistoryPage() {
  const [startDate, setStartDate] = useState<Date | null>(currentDate);
  const [stopDate, setStopDate] = useState<Date | null>(currentDate);
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
        <Flex justify="flex-end" align="center" gap={3}>
          <Text>Filtrer par dates : </Text>
          <Box>
            <ReactDatePicker
              selected={startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                setStartDate(start);
                setStopDate(end);
              }}
              customInput={<Input textAlign="center" cursor="pointer" />}
              startDate={startDate}
              endDate={stopDate}
              maxDate={new Date()}
              selectsRange
              dateFormat="dd/MM/yyyy"
            />
          </Box>
        </Flex>
      </Box>
      <TotalDays stats={data} />
    </>
  );
}
