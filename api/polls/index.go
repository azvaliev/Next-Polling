package index

import (
	"context"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	utils "next-polling/api-utils"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongodb "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Poll struct {
	Question        string
	Duration        int32
	ResponseOptions []string
}

type CreatePollResponse struct {
	ID string
}

func Handler(res http.ResponseWriter, req *http.Request) {
	// initialize mongodb connection
	coll, err := utils.Db()
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		if coll != nil {
			coll.Database().Client().Disconnect(context.TODO())
		}
		log.Fatal(err)
	}

	if req.Method == "POST" {
		handleNewPoll(res, req, coll)
		coll.Database().Client().Disconnect(context.TODO())
	} else {
		res.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

func handleNewPoll(res http.ResponseWriter, req *http.Request, coll *mongodb.Collection) {
	// read body
	b, err := ioutil.ReadAll(req.Body)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	// log the request
	// utils.RequestLogger("POST", "/polls", b)

	// create a variable to store unmarshalled JSON
	var reqData Poll
	err = json.Unmarshal(b, &reqData)
	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		return
	}

	// validate data
	if reqData.Duration < 2 || reqData.Duration > 180 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Failed to create poll. Duration must be be betwen 2 and 180 minutes"))
		return
	}
	// TODO: Allow more response options than 2
	if len(reqData.Question) < 1 || len(reqData.ResponseOptions) != 2 {
		res.WriteHeader(http.StatusBadRequest)
		res.Write([]byte("Failed to create poll. Missing question or not enough poll options provided"))
		return
	}

	// expire one hour after poll ends
	expireAt := time.Now().Add(time.Minute * time.Duration(reqData.Duration))

	// create index to automatically expire in time
	// TODO: Increase expireAfterSeconds to allow viewing after voting is over
	_, err = coll.Indexes().CreateOne(context.TODO(), mongodb.IndexModel{
		Keys: bson.M{
			"expireAt": 1,
		},
		Options: options.Index().SetExpireAfterSeconds(0),
	})
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		log.Println("failed to create expireAt index", err.Error())
		return
	}

	// initialize an empty array for responses
	responses := make([]int, len(reqData.ResponseOptions))

	// insert a new document into mongo collection
	insertRes, err := coll.InsertOne(context.TODO(), bson.M{
		"question":        reqData.Question,
		"responseOptions": reqData.ResponseOptions,
		"responses":       responses,
		"expireAt":        expireAt,
	})
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		log.Println("Failed to insert", err.Error())
		return
	}

	if oid, ok := insertRes.InsertedID.(primitive.ObjectID); ok {
		res.Header().Set("Content-Type", "application/json")
		res.WriteHeader(http.StatusCreated)

		responseData := CreatePollResponse{
			ID: oid.Hex(),
		}

		json.NewEncoder(res).Encode(responseData)
		return
	}

	res.WriteHeader(http.StatusInternalServerError)
	log.Println("Failed to retrive objectID of new entry")
}
