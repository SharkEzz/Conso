package handlers

import (
	"net/http"

	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetCurrentTempo(c *fiber.Ctx) error {
	tempo, err := utils.GetTempo()
	if err != nil {
		return c.JSON(err)
	}

	response := utils.GenerateResponse(http.StatusOK, "", tempo)

	return c.JSON(response)
}
