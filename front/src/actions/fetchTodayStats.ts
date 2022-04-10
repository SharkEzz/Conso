import axios from 'axios';

export type Consumption = {
  CreatedAt: string;
  DayColor: string;
  FullHourPrice: number;
  ID: number;
  PeakHoursPrice: number;
  Power: number;
  Temperature: number;
  UpdatedAt: string;
  Voltage: number;
};

export type StatsResponse = {
  Consumptions: Array<Consumption>;
  HourConsumptions: Record<number, number>;
  TotalAverage: number;
  TodayDate: string;
  Tempo: string;
  FullHourPrice: string;
  PeakHourPrice: string;
};

export default async function fetchTodayStats() {
  const res = await axios('/stats/today');

  const data = res.data?.Data as StatsResponse | null;

  if (!data) {
    throw new Error('invalid response');
  }

  return data;
}
