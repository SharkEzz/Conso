package types

type TempoRawResponseItem struct {
	Tempo string
}

type TempoRawResponse struct {
	JourJ1 TempoRawResponseItem
	JourJ  TempoRawResponseItem
}

type TempoResponse struct {
	Today    string
	Tomorrow string
}
