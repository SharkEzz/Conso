package handlers

import (
	"time"

	"github.com/SharkEzz/elec/database/models"
	"github.com/gofiber/fiber/v2"
)

func (b *Handler) GetTodayStats(c *fiber.Ctx) error {
	var consumptions []models.Consumption

	b.db.Where(
		"created_at >= ? AND created_at < ?",
		time.Now().Format("2006-01-02")+" 06:00:00",
		time.Now().Add(24*time.Hour).Format("2006-01-02")+" 06:00:00",
	).Find(&consumptions)

	return c.JSON(consumptions)
}
