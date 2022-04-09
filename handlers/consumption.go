package handlers

import (
	"encoding/json"
	"time"

	"github.com/SharkEzz/elec/database/models"
	"github.com/SharkEzz/elec/types"
	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"
)

func (b *Handler) GetTodayStats(c *fiber.Ctx) error {
	var consumptions []models.Consumption

	b.db.Where(
		"created_at >= ? AND created_at < ?",
		time.Now().Format("2006-01-02")+" 06:00:00",
		time.Now().AddDate(0, 0, 1).Format("2006-01-02")+" 06:00:00",
	).Find(&consumptions)

	total := computeTotal(&consumptions)
	perHour := computePerHour(&consumptions)

	responsePayload := types.ConsumptionsResponse{
		Consumptions:     consumptions,
		HourConsumptions: perHour,
		TotalAverage:     total,
		TodayDate:        time.Now().Format("2006-01-02") + " 06:00:00",
	}

	return c.JSON(utils.GenerateResponse(200, "", responsePayload))
}

func (b *Handler) GetStatsWithFilters(c *fiber.Ctx) error {
	filters := c.Query("filters", "")

	var from time.Time
	var to time.Time

	if filters == "" {
		// Default to last month from now if no filters specified
		from = time.Now().AddDate(0, -1, 0)
		to = time.Now()
	} else {
		var filtersJson map[string]string
		err := json.Unmarshal([]byte(filters), &filtersJson)
		if err != nil {
			return err
		}

		from, err = time.Parse(time.RFC3339, filtersJson["from"])
		if err != nil {
			return err
		}
		to, err = time.Parse(time.RFC3339, filtersJson["to"])
		if err != nil {
			return err
		}
	}

	var consumptions []models.Consumption

	b.db.Where(
		"created_at >= ? AND created_at <= ?",
		from,
		to,
	).Find(&consumptions)

	total := computeTotal(&consumptions)

	responsePayload := types.ConsumptionsResponse{
		Consumptions: consumptions,
		TodayDate:    time.Now().Format("2006-01-02") + " 06:00:00",
		TotalAverage: total,
	}

	return c.JSON(utils.GenerateResponse(200, "", responsePayload))
}

func computePerHour(consumptions *[]models.Consumption) map[int]float64 {
	data := map[int]float64{}
	count := map[int]int{}

	for _, item := range *consumptions {
		hour := item.CreatedAt.Hour()
		data[hour] += item.Power
		count[hour]++
	}

	for key, item := range data {
		data[key] = item / float64(count[key])
	}

	return data
}

func computeTotal(consumptions *[]models.Consumption) float64 {
	if len(*consumptions) == 0 {
		return 0.
	}

	var total float64
	for _, item := range *consumptions {
		total += item.Power
	}

	// Total in Wh
	total /= float64(len(*consumptions))

	return total
}
