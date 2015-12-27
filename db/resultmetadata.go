package db

import (
	"gopkg.in/mgo.v2/bson"
	"faceoff/models"
)

func GetAllResultMetadata () ([]models.SizeBenchmarkResult, error) {
	var result []models.SizeBenchmarkResult
	iter := c.Find(nil).
		Select(bson.M{"metadata" : 1}).
		Sort("metadata.date").Iter()

	if err := iter.All(&result); err != nil {
		return nil, err
	}
	return result, nil
}
