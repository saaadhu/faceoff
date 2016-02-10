package db

import (
	"gopkg.in/mgo.v2"
)

var c *mgo.Collection

func Init() {
	session, err := mgo.Dial("10.220.8.29")
	if err != nil {
		panic(err)
	}

	// Optional. Switch the session to a monotonic behavior.
	session.SetMode(mgo.Monotonic, true)

	c = session.DB("faceoff").C("sizebenchmarks")
}
