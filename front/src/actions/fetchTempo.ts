import axios from 'axios';

export type TempoResponse = {
  Today: string;
  Tomorrow: string;
};

export default async function fetchTempo(): Promise<TempoResponse> {
  const res = await axios('/tempo');
  const tempoData = res.data?.Data;

  if (!tempoData) {
    throw new Error('invalid response');
  }

  return tempoData as TempoResponse;
}
