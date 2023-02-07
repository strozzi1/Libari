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
	app.Post("/api/books", handlers.CreateBook)
	app.Get("/api/books", handlers.GetAllBooks)
	app.Delete("/api/books/:id", handlers.DeleteBookById)

	app.Post("/api/users", handlers.AddUser)

	log.Fatal(app.Listen(":3000"))
}
