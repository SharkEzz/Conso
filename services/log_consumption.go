package services

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"sync"
	"time"

	"github.com/SharkEzz/elec/constants"
	"github.com/SharkEzz/elec/database/models"
	"github.com/SharkEzz/elec/utils"
	"gorm.io/gorm"

	log "github.com/sirupsen/logrus"
)

// TODO: dynamic URL
const url = "http://192.168.0.11/sensor/"

func getVoltage() float64 {
	voltageData, err := http.Get(url + "pzem-004t_v3_voltage")
	if err != nil {
		log.Error("invalid voltage response", err)
		return -1
	}

	body, err := ioutil.ReadAll(voltageData.Body)
	if err != nil {
		log.Error("error while reading voltage response body", err)
		return -1
	}
	var bodyMap map[string]any
	err = json.Unmarshal(body, &bodyMap)
	if err != nil {
		log.Error("error while unmarshaling voltage json", err)
		return -1
	}

	return bodyMap["value"].(float64)
}

func getPower() float64 {
	powerData, err := http.Get(url + "pzem-004t_v3_power")
	if err != nil {
		log.Error("invalid power response", err)
		return -1
	}

	body, err := ioutil.ReadAll(powerData.Body)
	if err != nil {
		log.Error("error while reading power response body", err)
		return -1
	}
	var bodyMap map[string]any
	err = json.Unmarshal(body, &bodyMap)
	if err != nil {
		log.Error("error while unmarshaling power json", err)
		return -1
	}

	return bodyMap["value"].(float64)
}

func LogConsumption(db *gorm.DB) {
	currentDay := time.Now().Format("2006-01-02") + " 00:00:00"
	limitDay := time.Now().AddDate(0, 0, 1).Format("2006-01-02") + " 00:00:00"

	var count int64
	var day *models.Day
	db.Where("created_at >= ? AND created_at < ?", currentDay, limitDay).Find(&day).Count(&count)

	if count == 0 {
		log.Info("creating new day")
		dayTempo, err := utils.GetTempo()
		if err != nil {
			log.Error("error while getting new day tempo, skipping current logging")
			return
		}

		var fullHourPrice float64
		var peakHourPrice float64

		switch dayTempo.Today {
		case "TEMPO_ROUGE":
			fullHourPrice = constants.RedFullHourPrice
			peakHourPrice = constants.RedPeakHourPrice
		case "TEMPO_BLANC":
			fullHourPrice = constants.WhiteFullHourPrice
			peakHourPrice = constants.WhitePeakHourPrice
		case "TEMPO_BLEU":
			fullHourPrice = constants.BlueFullHourPrice
			peakHourPrice = constants.BluePeakHourPrice
		}

		day = &models.Day{
			Tempo:         dayTempo.Today,
			FullHourPrice: fullHourPrice,
			PeakHourPrice: peakHourPrice,
		}

		db.Create(&day)
	}

	wg := sync.WaitGroup{}
	wg.Add(2)

	voltage := 0.
	power := 0.

	go func() {
		voltage = getVoltage()
		wg.Done()
	}()
	go func() {
		power = getPower()
		wg.Done()
	}()

	wg.Wait()

	consumption := models.ConsumptionLog{
		Temperature: 0,
		Power:       power,
		Voltage:     voltage,
		DayID:       day.ID,
	}

	db.Save(&consumption)

	log.Info("Logged consumption", consumption)
}
