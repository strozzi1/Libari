package main

import (
	"fmt"
	"goserver/internal/handlers"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	fmt.Println("hello world!")

	app := fiber.New()

	//easy middleware example
	app.Use("/api", func(c *fiber.Ctx) error {
		fmt.Println("Hello from middleware")
		return c.Next()
	})

	app.Get("/healthcheck", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

	//35 mins in
	//BOOKS endpoints
	app.Post("/api/books", handlers.CreateBook)
	app.Get("/api/books", handlers.GetAllBooks)
	app.Delete("/api/books/:id", handlers.DeleteBookById)

	//USERS endpoints
	app.Post("/api/users", handlers.AddUser)
	app.Delete("/api/users/:id", handlers.DeleteUserById)
	app.Get("/api/users", handlers.GetAllUsers)

	log.Fatal(app.Listen(":3000"))
}
