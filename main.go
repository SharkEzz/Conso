package main

import (
	"embed"
	"flag"
	"fmt"
	"net/http"
	"time"

	"github.com/SharkEzz/elec/database"
	"github.com/SharkEzz/elec/handlers"
	"github.com/SharkEzz/elec/services"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/filesystem"
	"gorm.io/gorm"
)

var (
	logTimer      = flag.Uint64("logTimer", 60, "The delay between 2 consumption logs in seconds")
	migrate       = flag.Bool("migrate", false, "Set to true to enable models migrations")
	disableLogger = flag.Bool("disableLogger", false, "Set to true to disable the periodic logger")
)

//go:embed front/dist/*
var content embed.FS

func main() {
	flag.Parse()

	db, err := database.InitDb(*migrate)
	if err != nil {
		panic(err)
	}

	app := fiber.New()

	registerRoutes(app, db)
	if !*disableLogger {
		registerLogger(db)
	}

	app.Use(filesystem.New(filesystem.Config{
		Root:       http.FS(content),
		PathPrefix: "front/dist",
	}))

	app.Listen(":8080")
}

func registerRoutes(app *fiber.App, db *gorm.DB) {
	baseHandler := handlers.NewHandler(db)

	apiGroup := app.Group("/api")

	apiGroup.Use(cors.New())

	apiGroup.Get("/tempo", baseHandler.GetCurrentTempo)
	apiGroup.Get("/prices", baseHandler.GetPrices)
	apiGroup.Get("/stats", baseHandler.GetStatsWithFilters)
	apiGroup.Get("/stats/today", baseHandler.GetTodayStats)
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
