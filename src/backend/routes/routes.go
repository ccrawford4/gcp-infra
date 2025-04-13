package routes

import (
	"github.com/gin-gonic/gin"
	"go.mod/v2/handlers"
)

func RegisterRoutes(r *gin.Engine) {
	r.GET("/api/restaurants", handlers.GetRestaurants)
	r.GET("/api/restaurants/:id", handlers.GetRestaurant)
	r.POST("/api/restaurants", handlers.CreateRestaurant)
	r.PUT("/api/restaurants/:id", handlers.UpdateRestaurant)
	r.DELETE("/api/restaurants/:id", handlers.DeleteRestaurant)
}
