import axios from 'axios';

export type Pricings = {
  Red: {
    FullHour: number;
    PeakHour: number;
  };
  White: {
    FullHour: number;
    PeakHour: number;
  };
  Blue: {
    FullHour: number;
    PeakHour: number;
  };
};

export default async function fetchPricing() {
  const res = await axios('/prices');

  const data = res.data?.Data as Pricings;

  if (!data) {
    throw new Error('invalid response');
  }

  return data;
}
