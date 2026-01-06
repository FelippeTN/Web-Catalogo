package models

import "time"

type ProductImage struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ProductID uint      `gorm:"not null;index" json:"product_id"`
	ImageURL  string    `gorm:"not null" json:"image_url"`
	Position  int       `gorm:"not null;default:0" json:"position"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
