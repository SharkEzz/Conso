import { useQuery } from 'react-query';
import fetchTodayStats from '../actions/fetchTodayStats';
import TotalDay from '../components/Total/TotalDay';

export default function Index() {
  const { data, isLoading, isError } = useQuery('todayStats', fetchTodayStats);

  if (isError || (!isLoading && !data)) {
    return <p>Une erreur est survenue</p>;
  }

  if (isLoading) {
    return null;
  }

  return (
    <TotalDay
      consumptions={data.Consumptions}
      hourlyConsumptions={data.HourConsumptions}
      average={data.TotalAverage}
      date={data.TodayDate}
    />
  );
}
