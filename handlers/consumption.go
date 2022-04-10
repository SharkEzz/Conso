package handlers

import (
	"sync"
	"time"

	"github.com/SharkEzz/elec/database/models"
	"github.com/SharkEzz/elec/types"
	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"
)

func (b *Handler) GetTodayStats(c *fiber.Ctx) error {
	var day models.Day

	// TODO: check better way to query relationships?
	b.db.Preload("ConsumptionLogs").Last(&day)

	var total float64
	var totalPerHour map[int]float64

	wg := sync.WaitGroup{}
	wg.Add(2)

	go func() {
		total = computeTotal(&day.ConsumptionLogs)
		wg.Done()
	}()
	go func() {
		totalPerHour = computePerHour(&day.ConsumptionLogs)
		wg.Done()
	}()

	wg.Wait()

	responsePayload := types.DailyConsumptionsResponse{
		Consumptions:     day.ConsumptionLogs,
		HourConsumptions: totalPerHour,
		TotalAverage:     total,
		TodayDate:        day.CreatedAt.Format("2006-01-02") + " 06:00:00",
		Tempo:            day.Tempo,
		FullHourPrice:    day.FullHourPrice,
		PeakHourPrice:    day.PeakHourPrice,
	}

	return c.JSON(utils.GenerateResponse(200, "", responsePayload))
}

func (b *Handler) GetStatsWithFilters(c *fiber.Ctx) error {

	from, err := time.Parse(time.RFC3339, c.Query("from", time.Now().AddDate(0, 0, -1).Format(time.RFC3339)))
	if err != nil {
		return err
	}
	to, err := time.Parse(time.RFC3339, c.Query("to", time.Now().Format(time.RFC3339)))
	if err != nil {
		return err
	}

	var days []models.Day

	// TODO: check better way to query relationships?
	b.db.Preload("ConsumptionLogs").Where("created_at >= ? AND created_at <= ?", from.Format("2006-01-02")+" 06:00:00", to.AddDate(0, 0, 1).Format("2006-01-02")+" 06:00:00").Find(&days)

	consumptions := map[string]types.DailyConsumptionsResponse{}

	for _, day := range days {
		var total float64
		var totalPerHour map[int]float64

		wg := sync.WaitGroup{}
		wg.Add(2)

		go func() {
			total = computeTotal(&day.ConsumptionLogs)
			wg.Done()
		}()
		go func() {
			totalPerHour = computePerHour(&day.ConsumptionLogs)
			wg.Done()
		}()

		wg.Wait()

		consumptions[day.CreatedAt.Format("2006-01-02")] = types.DailyConsumptionsResponse{
			Consumptions:     day.ConsumptionLogs,
			HourConsumptions: totalPerHour,
			TotalAverage:     total,
			TodayDate:        day.CreatedAt.Format("2006-01-02") + " 06:00:00",
			Tempo:            day.Tempo,
			FullHourPrice:    day.FullHourPrice,
			PeakHourPrice:    day.PeakHourPrice,
		}
	}

	return c.JSON(utils.GenerateResponse(200, "", consumptions))
}

func computePerHour(consumptions *[]models.ConsumptionLog) map[int]float64 {
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

func computeTotal(consumptions *[]models.ConsumptionLog) float64 {
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
