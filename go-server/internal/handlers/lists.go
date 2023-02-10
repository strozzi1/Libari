package handlers

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type List struct {
	ID        primitive.ObjectID   `bson:"_id" json:"_id"`
	UserId    primitive.ObjectID   `bson:"userId" json:"userId"`
	CreatedAt time.Time            `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time            `json:"updatedAt" bson:"updatedAt"`
	Books     []primitive.ObjectID `bson:"books" json:"books"`
}
