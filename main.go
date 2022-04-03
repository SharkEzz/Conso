package main

import (
	"flag"
	"fmt"
	"time"

	"github.com/SharkEzz/elec/database"
	"github.com/SharkEzz/elec/handlers"
	"github.com/SharkEzz/elec/services"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

var (
	logTimer = flag.Uint64("logTimer", 60, "The delay between 2 consumption logs in seconds")
	migrate  = flag.Bool("migrate", false, "Set to true to enable models migrations")
)

func main() {
	flag.Parse()

	db, err := database.InitDb(*migrate)
	if err != nil {
		panic(err)
	}

	app := fiber.New()

	registerRoutes(app, db)
	registerLogger(db)

	app.Listen(":8080")
}

func registerRoutes(app *fiber.App, db *gorm.DB) {
	baseHandler := handlers.NewHandler(db)

	app.Get("/tempo", baseHandler.GetCurrentTempo)
	app.Get("/stats", baseHandler.GetStatsWithFilters)
	app.Get("/stats/today", baseHandler.GetTodayStats)
}

func registerLogger(db *gorm.DB) {
	tickerInterval, _ := time.ParseDuration(fmt.Sprintf("%ds", *logTimer))
	ticker := time.NewTicker(tickerInterval)

	quit := make(chan struct{})
	go func() {
		for {
			select {
			case <-ticker.C:
				services.LogConsumption(db)
			case <-quit:
				ticker.Stop()
				return
			}
		}
	}()
}
