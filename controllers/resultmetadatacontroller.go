package controllers

import (
	"faceoff/db"
	"net/http"
	"github.com/gorilla/mux"
)

func getAllResultMetadata (w http.ResponseWriter, r *http.Request) {

	rs, err := db.GetAllResultMetadata()
	if err != nil {
		writeError (w, 500, err)
		return
	}

	writeJson (w, 200, rs)
}

func registerResultMetadataRoutes(router *mux.Router) {
	router.HandleFunc("/v0/resultmetadata", getAllResultMetadata).Methods("GET")
	//router.HandleFunc("/v0/test/{id}", readResultMetadata)
}

func initResultMetadataController(r *mux.Router) {
	registerResultMetadataRoutes(r)
}
