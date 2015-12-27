package db

import (
	"gopkg.in/mgo.v2/bson"
	"faceoff/models"
)

func GetFileResult(name string) (* models.SizeBenchmarkResult, error) {
	var result models.SizeBenchmarkResult
	if err := c.FindId(bson.ObjectIdHex(id)).One(&result); err != nil {
		return nil, err
	}
	return &result, nil
}
