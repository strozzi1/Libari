package handlers

import (
	"context"
	"goserver/internal/db"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
	Username  string             `json:"username"  bson:"username" validate:"required,ascii"`
	Email     string             `json:"email"     bson:"email" validate:"required,email"`
	Password  string             `json:"password"  bson:"password" validate:"required"`
	Role      string             `json:"role"      bson:"role" validate:"required"`
	List      primitive.ObjectID `json:"listId"    bson:"listId"` //https://vidler.app/blog/data/populate-golang-relationship-field-using-mongodb-aggregate-and-lookup
	//Following []primitive.ObjectID `json:"following" bson:"following"`
}

func ValidationUserStruct(u User) []*ErrorResponse {
	var errors []*ErrorResponse
	validate := validator.New()
	err := validate.Struct(u)

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

func AddUser(c *fiber.Ctx) error {
	user := User{
		ID:        primitive.NewObjectID(),
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := c.BodyParser(&user); err != nil {
		return err
	}
	if errors := ValidationUserStruct(user); errors != nil {
		return c.Status(400).JSON(errors)
	}

	client, err := db.GetMongoClient()
	if err != nil {
		return err
	}
	collection := client.Database(db.Database).Collection(string(db.UsersCollection))

	newUser, err := collection.InsertOne(context.TODO(), user)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(newUser)

}
