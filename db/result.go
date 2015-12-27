package db

import (
	"gopkg.in/mgo.v2/bson"
	"faceoff/models"
)

func GetResult(id string) (* models.SizeBenchmarkResult, error) {
	var result models.SizeBenchmarkResult
	if err := c.FindId(bson.ObjectIdHex(id)).One(&result); err != nil {
		return nil, err
	}
	return &result, nil
}

func GetResultsForFile(filename string) ([] models.SizeBenchmarkResult, error) {
	var result []models.SizeBenchmarkResult
	iter := c.Find(bson.M{"objsizes.filename" : filename, "elfsizes.filename" : filename}).
		Select(bson.M{"metadata" : 1, "objsizes.$" : 1, "elfsizes.$" : 1}).
		Sort("-metadata.date").Iter()
	if err := iter.All(&result); err != nil {
		return nil, err
	}
	return result, nil
}
