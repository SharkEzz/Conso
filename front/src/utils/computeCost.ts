import { Pricings } from '../actions/fetchPricing';

export default function computeCost(
  tempo: string | null,
  hourConsumption: Record<number, number>,
  pricings: Pricings,
): number {
  const hours = Object.keys(hourConsumption).map((h) => Number(h));

  let cost = 0;
  hours.forEach((h) => {
    switch (tempo) {
      case 'TEMPO_ROUGE':
        if (h >= 6 && h < 14) {
          cost += (hourConsumption[h] / 1000) * pricings.Red.FullHour;
        } else {
          cost += (hourConsumption[h] / 1000) * pricings.Red.PeakHour;
        }
        break;
      case 'TEMPO_BLANC':
        if (h >= 6 && h < 14) {
          cost += (hourConsumption[h] / 1000) * pricings.White.FullHour;
        } else {
          cost += (hourConsumption[h] / 1000) * pricings.White.PeakHour;
        }
        break;
      case 'TEMPO_BLEU':
        if (h >= 6 && h < 14) {
          cost += (hourConsumption[h] / 1000) * pricings.Blue.FullHour;
        } else {
          cost += (hourConsumption[h] / 1000) * pricings.Blue.PeakHour;
        }
        break;
      default:
        break;
    }
  });

  return Math.round((cost + Number.EPSILON) * 10000) / 10000;
}
