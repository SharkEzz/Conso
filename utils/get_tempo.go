package utils

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/SharkEzz/elec/types"
	log "github.com/sirupsen/logrus"
)

func processTempoRawResponse(tempoRes types.TempoRawResponse) types.TempoResponse {
	today := tempoRes.JourJ.Tempo
	tomorrow := tempoRes.JourJ1.Tempo

	return types.TempoResponse{
		Today:    today,
		Tomorrow: tomorrow,
	}
}

func GetTempo() (*types.TempoResponse, error) {
	t := time.Now().Format("2006-01-02")

	url := fmt.Sprintf("https://particulier.edf.fr/bin/edf_rc/servlets/ejptemponew?Date_a_remonter=%s&TypeAlerte=TEMPO", t)

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Info("error while creating GetTempo request", err)
		return nil, err
	}

	// Bypass endpoint browser check
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15")
	client := http.Client{}
	res, err := client.Do(req)
	if err != nil {
		log.Info("error while querying tempo API", err)
		return nil, err
	}

	content, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Info("error while reading tempo api response", err)
		return nil, err
	}

	tempoRawResponse := types.TempoRawResponse{}

	err = json.Unmarshal(content, &tempoRawResponse)
	if err != nil {
		log.Info("error while unmarshaling tempo json", err)
		return nil, err
	}

	tempo := processTempoRawResponse(tempoRawResponse)

	return &tempo, nil
}
