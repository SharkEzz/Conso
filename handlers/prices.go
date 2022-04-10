package handlers

import (
	"github.com/SharkEzz/elec/constants"
	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"
)

func (b *Handler) GetPrices(c *fiber.Ctx) error {
	prices := map[string]map[string]float64{
		"White": {
			"FullHour": constants.WhiteFullHourPrice,
			"PeakHour": constants.WhitePeakHourPrice,
		},
		"Red": {
			"FullHour": constants.RedFullHourPrice,
			"PeakHour": constants.RedPeakHourPrice,
		},
		"Blue": {
			"FullHour": constants.BlueFullHourPrice,
			"PeakHour": constants.BluePeakHourPrice,
		},
	}

	return c.JSON(utils.GenerateResponse(200, "", prices))
}
