package models

import (
	"time"
)

type Metadata struct {
	Title string `json:"title"`
	Date  time.Time   `json:"date"`
	Toolchain string `json:"toolchain"`
}
