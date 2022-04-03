package database

import (
	"github.com/SharkEzz/elec/database/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func InitDb() (*gorm.DB, error) {
	// TODO: environment variables
	dsn := "host=localhost user=elec password=elec dbname=elec port=5432 TimeZone=Europe/Paris"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	db.AutoMigrate(&models.Consumption{})

	return db, nil
}
