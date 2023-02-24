package handlers

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type List struct {
	ID        primitive.ObjectID `bson:"_id" json:"_id"`
	UserId    primitive.ObjectID `bson:"userId" json:"userId"`
	CreatedAt time.Time          `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt" bson:"updatedAt"`
	BookId    primitive.ObjectID `json:"-" bson:"book_id"` //test
	Books     []Book             `bson:"books" json:"books"`
}

/*func GetPaginatedPopulatedListFromId(c *fiber.Ctx) error {
	idPrimative, err := primitive.ObjectIDFromHex(c.Params("id"))
	if err != nil {
		return err
	}

	client, err := db.GetMongoClient()

	if err!=nil{
		return err
	}

	listCollection := client.Database(db.Database).Collection(string(db.ListsCollection))
	//bookCollection := client.Database(db.Database).Collection(string(db.BooksCollection))


	var bs []Book

	searchFilter := bson.M{"_id": idPrimative}

	var aggPopulate, aggProject bson.M

	aggPopulate = bson.M{"$lookup": bson.M{
		"from": "books",		//collection name
		"localField": "book-id", //reference field on list struct
		"foreignField": "_id",   // the field on book struct
		"as": "books",			//field to populate into
	}}

	aggProject = bson.M{"$project": bson.M{
		"books": bson.M{"arrayElemAt": []interface{}{"$books", 0}},
	}}

	cursor, err := listCollection.Aggregate(context.TODO(), []bson.M{
		searchFilter, aggPopulate, aggProject,
	})

	if err != nil {
		return err
	}

	res := cursor
	c.Status(201).JSON()
}
*/
