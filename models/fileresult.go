package models

type FileResult struct {
	Benchmark string `json:"benchmark"`
	Filename string `json:"filename"`
	Text  int64 `json:"text"`
	Data int64 `json:"data"`
	Bss int64 `json:"bss"`
}
