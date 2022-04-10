import axios from 'axios';
import { StatsResponse } from './fetchTodayStats';

export default async function fetchHistoryStats(
  from: Date | null,
  to: Date | null,
) {
  let params = '';
  if (from && to) {
    params = `?from=${from.toISOString()}&to=${to.toISOString()}`;
  }
  const res = await axios(`/stats${params}`);

  const data = res.data?.Data as StatsResponse[];

  if (!data) {
    throw new Error('invalid response');
  }

  return data;
}
