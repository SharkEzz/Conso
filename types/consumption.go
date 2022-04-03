package types

import "github.com/SharkEzz/elec/database/models"

type ConsumptionsResponse struct {
	Consumptions []models.Consumption
	TotalAverage float64
}
