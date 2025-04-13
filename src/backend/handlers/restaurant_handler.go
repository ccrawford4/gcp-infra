package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"go.mod/v2/db"
	"go.mod/v2/models"
	"net/http"
)

func GetRestaurants(c *gin.Context) {
	var restaurants []models.Restaurant
	db.DB.Find(&restaurants)
	c.JSON(http.StatusOK, restaurants)
}

func GetRestaurant(c *gin.Context) {
	var restaurant models.Restaurant
	fmt.Println("C.Param: ", c.Param("id"))
	if err := db.DB.First(&restaurant, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Restaurant not found"})
		return
	}
	c.JSON(http.StatusOK, restaurant)
}

func CreateRestaurant(c *gin.Context) {
	var restaurant models.Restaurant
	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Create(&restaurant)
	c.JSON(http.StatusCreated, restaurant)
}

func UpdateRestaurant(c *gin.Context) {
	var restaurant models.Restaurant
	if err := db.DB.First(&restaurant, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Restaurant not found"})
		return
	}
	if err := c.ShouldBindJSON(&restaurant); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	db.DB.Save(&restaurant)
	c.JSON(http.StatusOK, restaurant)
}

func DeleteRestaurant(c *gin.Context) {
	db.DB.Delete(&models.Restaurant{}, c.Param("id"))
	c.JSON(http.StatusNoContent, nil)
}
