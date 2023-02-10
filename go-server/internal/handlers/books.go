package handlers

import (
	"context"
	"goserver/internal/db"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Book struct {
	ID        primitive.ObjectID `json:"_id" bson:"_id" validate:"required"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
	Title     string             `json:"title" bson:"title" validate:"required,ascii,max=100"`
	Author    string             `json:"author" bson:"author" validate:"required,ascii,max=50"`
	Rating    int                `json:"rating" bson:"rating"`
	Status    string             `json:"status" bson:"status"` //'Planning' 'Reading' 'Dropped' 'Completed'
	Image     string             `json:"image" bson:"image"`   //imageUrl as string
}

// TODO: Move out, make validation a generic function?
type ErrorResponse struct {
	FailedField string
	Tag         string
	Value       string
}

func ValidationBookStruct(b Book) []*ErrorResponse {
	var errors []*ErrorResponse
	validate := validator.New()
	err := validate.Struct(b)

	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)

		}
	}
	return errors
}

func CreateBook(c *fiber.Ctx) error {
	book := Book{
		ID:        primitive.NewObjectID(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := c.BodyParser(&book); err != nil {
		return err
	}

	errors := ValidationBookStruct(book)

	if errors != nil {
		return c.JSON(errors)
	}

	client, err := db.GetMongoClient()

	if err != nil {
		return err
	}

	collection := client.Database(db.Database).Collection(string(db.BooksCollection))

	_, err = collection.InsertOne(context.TODO(), book)

	if err != nil {
		return err
	}

	return c.JSON(book)
}

func GetAllBooks(c *fiber.Ctx) error {
	client, err := db.GetMongoClient()

	if err != nil {
		return err
	}
	var books []*Book

	collection := client.Database(db.Database).Collection(string(db.BooksCollection))

	//empty context
	cur, err := collection.Find(context.TODO(), bson.D{
		primitive.E{
			//would fill with arguments to find stuff, but not now
		},
	})

	if err != nil {
		return err
	}

	for cur.Next(context.TODO()) {
		var b Book
		err := cur.Decode(&b)

		if err != nil {
			return err
		}
		books = append(books, &b)

	}
	return c.Status(200).JSON(books)
}

func DeleteBookById(c *fiber.Ctx) error {
	client, err := db.GetMongoClient()

	if err != nil {
		return err
	}

	collection := client.Database(db.Database).Collection(string(db.BooksCollection))

	idPrimative, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return err
	}
	//searchFilter := bson.M{"_id": idPrimative}
	var deletedDoc bson.M
	er := collection.FindOneAndDelete(context.TODO(), bson.M{"_id": idPrimative}).Decode(&deletedDoc)
	if er != nil {
		return er
	}
	return c.Status(201).JSON(bson.M{"Deleted": deletedDoc})

}
