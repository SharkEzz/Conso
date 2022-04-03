package services

import (
	"fmt"

	"gorm.io/gorm"
)

func LogConsumption(db *gorm.DB) {
	fmt.Println("logging")
}
