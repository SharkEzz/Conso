package types

import (
	"github.com/SharkEzz/elec/database/models"
)

type ConsumptionsResponse struct {
	Consumptions     []models.ConsumptionLog
	HourConsumptions map[int]float64
	TotalAverage     float64
	TodayDate        string
}
