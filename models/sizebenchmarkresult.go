package models

import ("gopkg.in/mgo.v2/bson")

type SizeBenchmarkResult struct {
	Id  bson.ObjectId `json:"id" bson:"_id"`
	Metadata Metadata  `json:"metadata"`
	ObjSizes []FileResult `json:"objsizes"`
	ElfSizes  []FileResult `json:"elfsizes"`
}
