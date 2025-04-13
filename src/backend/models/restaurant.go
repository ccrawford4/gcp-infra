package models

import "github.com/jinzhu/gorm"

type Restaurant struct {
	gorm.Model
	Name     string `json:"name"`
	Location string `json:"location"`
	Cuisine  string `json:"cuisine"`
}
