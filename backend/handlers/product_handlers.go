package handlers

import (
	"net/http"
	"strconv"

	"github.com/FelippeTN/Web-Catalogo/backend/database"
	"github.com/FelippeTN/Web-Catalogo/backend/models"
	"github.com/gin-gonic/gin"
)

type createProductInput struct {
	Name         string  `json:"name" binding:"required"`
	Description  string  `json:"description" binding:"required"`
	Price        float64 `json:"price" binding:"required"`
	CollectionID *uint   `json:"collection_id"`
}

func CreateProduct(c *gin.Context) {
	ownerID, ok := getUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input createProductInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data"})
		return
	}

	if input.CollectionID != nil {
		var collection models.Collection
		if err := database.DB.Where("id = ? AND owner_id = ?", *input.CollectionID, ownerID).First(&collection).Error; err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid collection_id"})
			return
		}
	}

	product := models.Product{
		OwnerID:      ownerID,
		CollectionID: input.CollectionID,
		Name:         input.Name,
		Description:  input.Description,
		Price:        input.Price,
	}

	if err := database.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create product"})
		return
	}

	c.JSON(http.StatusCreated, product)
}

func GetProducts(c *gin.Context) {
	var products []models.Product

	query := database.DB.Model(&models.Product{})
	if ownerIDRaw := c.Query("owner_id"); ownerIDRaw != "" {
		ownerIDParsed, err := strconv.ParseUint(ownerIDRaw, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid owner_id"})
			return
		}
		query = query.Where("owner_id = ?", uint(ownerIDParsed))
	}
	if collectionIDRaw := c.Query("collection_id"); collectionIDRaw != "" {
		collectionIDParsed, err := strconv.ParseUint(collectionIDRaw, 10, 64)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid collection_id"})
			return
		}
		query = query.Where("collection_id = ?", uint(collectionIDParsed))
	}

	if err := query.Order("created_at desc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func GetMyProducts(c *gin.Context) {
	ownerID, ok := getUserIDFromContext(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var products []models.Product
	if err := database.DB.Where("owner_id = ?", ownerID).Order("created_at desc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve products"})
		return
	}

	c.JSON(http.StatusOK, products)
}
