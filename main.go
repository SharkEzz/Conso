package main

import (
	"github.com/SharkEzz/elec/handlers"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := fiber.New()

	app.Get("/tempo", handlers.GetCurrentTempo)

	app.Listen(":8080")
}
