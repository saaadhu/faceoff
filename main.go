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

	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./www")))
	r.Handle("/", http.FileServer(http.Dir("./www")))

	panic(http.ListenAndServe(":8080", r))
}
