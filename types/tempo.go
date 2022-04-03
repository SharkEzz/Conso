package types

type tempoRawResponseItem struct {
	Tempo string
}

type TempoRawResponse struct {
	JourJ1 tempoRawResponseItem
	JourJ  tempoRawResponseItem
}

type TempoResponse struct {
	Today    string
	Tomorrow string
}
