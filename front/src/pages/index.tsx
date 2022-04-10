import { Spinner } from '@chakra-ui/react';
import { useQuery } from 'react-query';
import fetchTodayStats from '../actions/fetchTodayStats';
import TotalDay from '../components/Total/TotalDay';

export default function Index() {
  const { data, isLoading, isError } = useQuery('todayStats', fetchTodayStats);

  if (isError || (!isLoading && !data)) {
    return <p>Une erreur est survenue</p>;
  }

  if (isLoading) {
    return <Spinner />;
  }

  return <TotalDay stats={data} />;
}
