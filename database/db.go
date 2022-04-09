package database

import (
	"github.com/SharkEzz/elec/database/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitDb(migrate bool) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open("data.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	if migrate {
		db.AutoMigrate(&models.Consumption{})
	}

	return db, nil
}
