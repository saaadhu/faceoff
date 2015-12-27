package main

import (
	"net/http"
	"github.com/gorilla/mux"
	"faceoff/db"
	"faceoff/controllers"
)


func main() {
	db.Init()

	r := mux.NewRouter()
	controllers.Init(r)

	http.Handle("/", r)
	panic(http.ListenAndServe(":8080", r))
}
