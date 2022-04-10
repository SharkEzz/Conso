package models

import "gorm.io/gorm"

type Day struct {
	gorm.Model
	Tempo           string
	FullHourPrice   float64
	PeakHourPrice   float64
	ConsumptionLogs []ConsumptionLog
}
