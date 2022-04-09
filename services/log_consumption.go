package services

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"sync"

	"github.com/SharkEzz/elec/database/models"
	"github.com/SharkEzz/elec/utils"
	"gorm.io/gorm"
)

const url = "http://192.168.0.11/sensor/"

func getVoltage() float64 {
	voltageData, err := http.Get(url + "pzem-004t_v3_voltage")
	if err != nil {
		return -1
	}

	body, err := ioutil.ReadAll(voltageData.Body)
	if err != nil {
		return -1
	}
	var bodyMap map[string]any
	err = json.Unmarshal(body, &bodyMap)
	if err != nil {
		return -1
	}

	return bodyMap["value"].(float64)
}

func getPower() float64 {
	powerData, err := http.Get(url + "pzem-004t_v3_power")
	if err != nil {
		return -1
	}

	body, err := ioutil.ReadAll(powerData.Body)
	if err != nil {
		return -1
	}
	var bodyMap map[string]any
	err = json.Unmarshal(body, &bodyMap)
	if err != nil {
		return -1
	}

	return bodyMap["value"].(float64)
}

func LogConsumption(db *gorm.DB) {
	voltage := 0.
	power := 0.
	var dayColor string

	wg := sync.WaitGroup{}
	wg.Add(2)

	go func() {
		voltage = getVoltage()
		wg.Done()
	}()
	go func() {
		power = getPower()
		wg.Done()
	}()
	go func() {
		tempo, err := utils.GetTempo()
		if err != nil {
			dayColor = ""
		}
		dayColor = tempo.Today
	}()

	wg.Wait()

	consumption := models.Consumption{
		DayColor:       dayColor,
		FullHourPrice:  0,
		PeakHoursPrice: 0,
		Temperature:    0,
		Power:          power,
		Voltage:        voltage,
	}

	db.Save(&consumption)

	fmt.Println("logging")
}
