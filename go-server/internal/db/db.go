package db

import (
	"context"
	"sync"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var clientInstance *mongo.Client

var mongoOnce sync.Once

var clientInstanceError error

type Collection string

const (
	BooksCollection Collection = "books"
)

const (
	url      = "mongodb://localhost:27017"
	Database = "books-api"
)

func GetMongoClient() (*mongo.Client, error) {
	// ensures we only ever run this function once
	// don't wanna have to reconnect everytime we call GetMongoClient
	mongoOnce.Do(func() {
		clientOptions := options.Client().ApplyURI(url)

		//context.TODO() is a stand in context for when we don't have one to pass it
		client, err := mongo.Connect(context.TODO(), clientOptions)

		clientInstance = client

		clientInstanceError = err
	})
	return clientInstance, clientInstanceError
}
