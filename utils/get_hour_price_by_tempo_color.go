package utils

import "github.com/SharkEzz/elec/constants"

func GetHourPriceByTempoColor(color string, isFullHour bool) float64 {
	var peakPrice float64
	var fullPrice float64

	switch color {
	case constants.TEMPO_ROUGE:
		peakPrice = constants.RedPeakHourPrice
		fullPrice = constants.RedFullHourPrice
	case constants.TEMPO_BLANC:
		peakPrice = constants.WhitePeakHourPrice
		fullPrice = constants.WhiteFullHourPrice
	case constants.TEMPO_BLEU:
		peakPrice = constants.BluePeakHourPrice
		fullPrice = constants.BlueFullHourPrice
	}

	if isFullHour {
		return fullPrice
	}
	return peakPrice
}
