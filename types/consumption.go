package types

import (
	"github.com/SharkEzz/elec/database/models"
)

type DailyConsumptionsResponse struct {
	Consumptions     []models.ConsumptionLog
	HourConsumptions map[int]float64
	TotalAverage     float64
	TodayDate        string
	Tempo            string
	FullHourPrice    float64
	PeakHourPrice    float64
	TotalCost        float64
}
