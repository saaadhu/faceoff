package db

import (
	"faceoff/models"
	"gopkg.in/mgo.v2/bson"
)

func GetFileResult(id string) (*models.SizeBenchmarkResult, error) {
	var result models.SizeBenchmarkResult
	if err := c.FindId(bson.ObjectIdHex(id)).One(&result); err != nil {
		return nil, err
	}
	return &result, nil
}
