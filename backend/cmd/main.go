package main

import (
	"github.com/FelippeTN/Web-Catalogo/backend/database"
	"github.com/FelippeTN/Web-Catalogo/backend/handlers"
	"github.com/FelippeTN/Web-Catalogo/backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	database.ConnectDatabase()

	r := gin.Default()

	r.Use(cors.Default())

	publicRoutes := r.Group("/public")
	{
		publicRoutes.POST("/login", handlers.Login)
		publicRoutes.POST("/register", handlers.Register)
		publicRoutes.GET("/products", handlers.GetProducts)
		publicRoutes.GET("/collections", handlers.GetPublicCollections)
	}

	protectedRoutes := r.Group("/protected")
	protectedRoutes.Use(middleware.AuthenticationMiddleware())
	{
		protectedRoutes.POST("/collections", handlers.CreateCollection)
		protectedRoutes.GET("/collections", handlers.GetMyCollections)
		protectedRoutes.PUT("/collections/:id", handlers.UpdateCollection)
		protectedRoutes.DELETE("/collections/:id", handlers.DeleteCollection)

		protectedRoutes.POST("/products", handlers.CreateProduct)
		protectedRoutes.GET("/products", handlers.GetMyProducts)
	}

	r.Run(":8080")
}
