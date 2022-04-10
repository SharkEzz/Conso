package models

import "gorm.io/gorm"

type ConsumptionLog struct {
	gorm.Model
	Temperature float64
	Power       float64
	Voltage     float64
	DayID       uint
}
