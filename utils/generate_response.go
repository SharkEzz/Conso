package utils

type apiResponse[T any] struct {
	Code    int
	Message string
	Data    T
}

func GenerateResponse[T any](code int, message string, data T) apiResponse[T] {
	return apiResponse[T]{
		Code:    code,
		Message: message,
		Data:    data,
	}
}
