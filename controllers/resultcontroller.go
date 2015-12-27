package controllers

import (
	"faceoff/db"
	"net/http"
	"github.com/gorilla/mux"
)

func readResult (w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	
	rs, err := db.GetResult(id)
	if err != nil {
		writeError (w, 500, err)
		return
	}

	writeJson (w, 200, rs)
}

func getFileResults (w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]
	
	rs, err := db.GetResultsForFile(id)
	if err != nil {
		writeError (w, 500, err)
		return
	}

	writeJson (w, 200, rs)
}

func registerResultRoutes(router *mux.Router) {
	router.HandleFunc("/v0/result/{id}", readResult).Methods("GET")
	router.HandleFunc("/v0/result/filename/{id}", getFileResults).Methods("GET")
}

func initResultController(r *mux.Router) {
	registerResultRoutes(r)
}
