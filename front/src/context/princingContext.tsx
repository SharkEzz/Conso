import { createContext } from 'react';
import { Pricings } from '../actions/fetchPricing';

export const initialValue: Pricings = {
  Red: {
    FullHour: 0,
    PeakHour: 0,
  },
  White: {
    FullHour: 0,
    PeakHour: 0,
  },
  Blue: {
    FullHour: 0,
    PeakHour: 0,
  },
};

const PricingContext = createContext<Pricings>(initialValue);

export default PricingContext;
