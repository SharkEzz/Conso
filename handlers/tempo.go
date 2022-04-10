package handlers

import (
	"net/http"

	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"

	log "github.com/sirupsen/logrus"
)

func (h *Handler) GetCurrentTempo(c *fiber.Ctx) error {
	tempo, err := utils.GetTempo()
	if err != nil {
		log.Error("error while getting tempo", err)
		return c.JSON(err)
	}

	response := utils.GenerateResponse(http.StatusOK, "", tempo)

	return c.JSON(response)
}
