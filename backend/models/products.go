package models

import "time"

type Product struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	OwnerID      uint      `gorm:"not null;index" json:"owner_id"`
	CollectionID *uint     `gorm:"index" json:"collection_id"`
	Name         string    `gorm:"not null" json:"name"`
	Description  string    `gorm:"not null" json:"description"`
	Price        float64   `gorm:"not null" json:"price"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}
