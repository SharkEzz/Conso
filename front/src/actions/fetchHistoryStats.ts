import axios from 'axios';
import { StatsResponse } from './fetchTodayStats';

export default async function fetchHistoryStats() {
  const res = await axios('/stats');

  const data = res.data?.Data as StatsResponse;

  if (data === null) {
    throw new Error('invalid response');
  }

  return data;
}
