package utils

import "fmt"

func RequestLogger[D []byte | string](reqMethod string, route string, data D) {
	fmt.Printf("\n%s %s \n %s \n", reqMethod, route, string(data))
}
