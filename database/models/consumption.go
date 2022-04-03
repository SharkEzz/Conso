package models

import "gorm.io/gorm"

type Consumption struct {
	gorm.Model
	DayColor       string
	FullHourPrice  float64
	PeakHoursPrice float64
	Temperature    float64
	Power          float64
	Voltage        float64
}
