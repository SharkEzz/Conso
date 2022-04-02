package main

import (
	"github.com/SharkEzz/elec/handlers"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dsn := "host=localhost user=elec password=elec dbname=elec port=5432 TimeZone=Europe/Paris"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	app := fiber.New()

	baseHandler := handlers.NewHandler(db)

	app.Get("/tempo", baseHandler.GetCurrentTempo)

	app.Listen(":8080")
}
