package handlers

import (
	"math"
	"sync"
	"time"

	"github.com/SharkEzz/elec/constants"
	"github.com/SharkEzz/elec/database/models"
	"github.com/SharkEzz/elec/types"
	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	log "github.com/sirupsen/logrus"
)

func (b *Handler) GetTodayStats(c *fiber.Ctx) error {
	var day *models.Day

	// TODO: check better way to query relationships?
	b.db.Preload("ConsumptionLogs").Order("created_at DESC").Last(&day)

	if day == nil {
		c.Status(fiber.StatusInternalServerError)
		return c.JSON(utils.GenerateResponse(fiber.StatusInternalServerError, "no day found", nil))
	}

	if day.ConsumptionLogs == nil {
		day.ConsumptionLogs = []models.ConsumptionLog{}
	}

	yesterdayColor := findYesterdayColor(day, b.db)

	var total float64
	totalPerHour := map[int]float64{}

	wg := sync.WaitGroup{}
	wg.Add(2)

	go func() {
		total = computeTotalConsumption(yesterdayColor, &day.ConsumptionLogs)
		wg.Done()
	}()
	go func() {
		totalPerHour = computePerHourConsumption(yesterdayColor, &day.ConsumptionLogs)
		wg.Done()
	}()

	wg.Wait()

	responsePayload := types.DailyConsumptionsResponse{
		Consumptions:     day.ConsumptionLogs,
		HourConsumptions: totalPerHour,
		TotalAverage:     total,
		TodayDate:        day.CreatedAt.Format("2006-01-02"),
		Tempo:            day.Tempo,
		FullHourPrice:    day.FullHourPrice,
		PeakHourPrice:    day.PeakHourPrice,
		TotalCost:        computeTotalDailyCost(yesterdayColor, day.Tempo, totalPerHour),
	}

	return c.JSON(utils.GenerateResponse(200, "", responsePayload))
}

func (b *Handler) GetStatsWithFilters(c *fiber.Ctx) error {
	from, err := time.Parse(time.RFC3339, c.Query("from", time.Now().Format(time.RFC3339)))
	if err != nil {
		log.Error("invalid 'from' filter", err)
		return err
	}
	to, err := time.Parse(time.RFC3339, c.Query("to", time.Now().Format(time.RFC3339)))
	if err != nil {
		log.Error("invalid 'to' filter", err)
		return err
	}

	var days []models.Day

	// TODO: check better way to query relationships?
	b.db.
		Preload("ConsumptionLogs").
		Where(
			"created_at >= ? AND created_at < ?",
			from.Format("2006-01-02")+" 00:00:00",
			to.AddDate(0, 0, 1).Format("2006-01-02")+" 00:00:00",
		).Find(&days)

	consumptions := make([]types.DailyConsumptionsResponse, len(days))

	for index, day := range days {
		var total float64
		var totalPerHour map[int]float64

		if day.ConsumptionLogs == nil {
			day.ConsumptionLogs = []models.ConsumptionLog{}
		}

		wg := sync.WaitGroup{}
		wg.Add(2)

		yesterdayColor := findYesterdayColor(&day, b.db)

		go func() {
			total = computeTotalConsumption(yesterdayColor, &day.ConsumptionLogs)
			wg.Done()
		}()
		go func() {
			totalPerHour = computePerHourConsumption(yesterdayColor, &day.ConsumptionLogs)
			wg.Done()
		}()

		wg.Wait()

		consumptions[index] = types.DailyConsumptionsResponse{
			Consumptions:     day.ConsumptionLogs,
			HourConsumptions: totalPerHour,
			TotalAverage:     total,
			TodayDate:        day.CreatedAt.Format("2006-01-02"),
			Tempo:            day.Tempo,
			FullHourPrice:    day.FullHourPrice,
			PeakHourPrice:    day.PeakHourPrice,
			TotalCost:        computeTotalDailyCost(yesterdayColor, day.Tempo, totalPerHour),
		}
	}

	return c.JSON(utils.GenerateResponse(200, "", consumptions))
}

func computePerHourConsumption(yesterdayColor string, consumptions *[]models.ConsumptionLog) map[int]float64 {
	data := map[int]float64{}

	if len(*consumptions) == 0 {
		return data
	}

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

func computeTotalConsumption(yesterdayColor string, consumptions *[]models.ConsumptionLog) float64 {
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

func computeTotalDailyCost(yesterdayColor string, todayColor string, todayPerHourConsumptions map[int]float64) float64 {
	previousDayPeakHourPrice := utils.GetHourPriceByTempoColor(yesterdayColor, false)
	todayFullHourPrice := utils.GetHourPriceByTempoColor(todayColor, true)
	todayPeakHourPrice := utils.GetHourPriceByTempoColor(todayColor, false)

	var cost float64

	for key, item := range todayPerHourConsumptions {
		if key >= 0 && key < 6 {
			cost += (item / 1000) * previousDayPeakHourPrice
			continue
		}

		if key >= 6 && key < 22 {
			cost += (item / 1000) * todayFullHourPrice
			continue
		}

		if key >= 22 && key <= 23 {
			cost += (item / 1000) * todayPeakHourPrice
			continue
		}

		cost += (item / 1000) * todayPeakHourPrice
	}

	return math.Round(cost*100) / 100
}

func findYesterdayColor(today *models.Day, db *gorm.DB) string {
	var yesterday *models.Day
	db.Where("id = ?", today.ID-1).Find(&yesterday)

	if yesterday == nil {
		log.Warn("previous day not found, setting white tempo")
		return constants.TEMPO_BLANC
	}

	return yesterday.Tempo
}
