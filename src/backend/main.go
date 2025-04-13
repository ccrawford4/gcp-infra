package main

import (
	"github.com/gin-gonic/gin"
	"go.mod/v2/db"
	"go.mod/v2/routes"
	"log"
)

func main() {
	r := gin.Default()
	db.ConnectDatabase()

	routes.RegisterRoutes(r)

	log.Println("Starting server on port 8080...")
	if err := r.Run("0.0.0.0:8080"); err != nil {
		log.Fatal(err)
	}
}
