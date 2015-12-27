package controllers

import (
	"github.com/gorilla/mux"
	"net/http"
	"encoding/json"
	"fmt"
	"log"
)

func Init (r *mux.Router) {
	initResultMetadataController (r)
	initResultController (r)
}

func writeJson(w http.ResponseWriter, code int, obj interface{}) {
	sj, _ := json.Marshal(obj)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	fmt.Fprintf(w, "%s", sj)
}

func writeError(w http.ResponseWriter, code int, err error) {
	if err != nil {
		//panic(err)
		log.Print(err)
	}
	w.WriteHeader(code)
	fmt.Fprintf(w, "%s", err)
}
