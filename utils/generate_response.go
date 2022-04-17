package utils

type apiResponse struct {
	Code    int
	Message string
	Data    any
}

func GenerateResponse(code int, message string, data any) apiResponse {
	return apiResponse{
		Code:    code,
		Message: message,
		Data:    data,
	}
}
