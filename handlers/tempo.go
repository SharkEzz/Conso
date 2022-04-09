package handlers

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/SharkEzz/elec/types"
	"github.com/SharkEzz/elec/utils"
	"github.com/gofiber/fiber/v2"
)

func (h *Handler) GetCurrentTempo(c *fiber.Ctx) error {
	t := time.Now().Format("2006-01-02")

	url := fmt.Sprintf("https://particulier.edf.fr/bin/edf_rc/servlets/ejptemponew?Date_a_remonter=%s&TypeAlerte=TEMPO", t)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return err
	}

	// Bypass endpoint browser check
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15")
	client := http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return err
	}

	content, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return err
	}

	tempoRawResponse := types.TempoRawResponse{}

	err = json.Unmarshal(content, &tempoRawResponse)
	if err != nil {
		return err
	}

	response := utils.GenerateResponse(http.StatusOK, "", processTempoRawResponse(&tempoRawResponse))

	//c.Set("Access-Control-Allow-Origin", "*")
	return c.JSON(response)
}

func processTempoRawResponse(tempoRes *types.TempoRawResponse) *types.TempoResponse {
	today := tempoRes.JourJ.Tempo
	tomorrow := tempoRes.JourJ1.Tempo

	return &types.TempoResponse{
		Today:    today,
		Tomorrow: tomorrow,
	}
}
