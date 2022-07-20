package index

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	utils "next-polling/api-utils"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	mongodb "go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Poll struct {
	Question        string
	Duration        int32
	ResponseOptions [2]string
	Responses       [2]int
	ExpireAt        time.Time
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

	} else if req.Method == "GET" {
		res.Header().Add("Access-Control-Allow-Origin", os.Getenv("VERCEL_URL"))
		pid := req.URL.Query().Get("pid")
		if len(pid) < 1 {
			coll.Database().Client().Disconnect(context.TODO())
			res.WriteHeader(http.StatusBadRequest)
			fmt.Fprintf(res, "Request failed: please provide a valid poll id (pid)")
			return
		}

		handleRequestPoll(res, req, coll, pid)

	} else {
		res.WriteHeader(http.StatusMethodNotAllowed)
	}
	coll.Database().Client().Disconnect(context.TODO())
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
	reqData.ExpireAt = time.Now().Add(time.Minute * time.Duration(reqData.Duration))

	// create index to automatically expire in time
	// TODO: Increase expireAfterSeconds to allow viewing after voting is over
	_, err = coll.Indexes().CreateOne(context.TODO(), mongodb.IndexModel{
		Keys: bson.M{
			"expireAt": 1,
		},
		Options: options.Index().SetExpireAfterSeconds(int32(time.Hour.Seconds() * 72)),
	})
	if err != nil {
		res.WriteHeader(http.StatusInternalServerError)
		log.Println("failed to create expireAt index", err.Error())
		return
	}

	// insert a new document into mongo collection
	insertRes, err := coll.InsertOne(context.TODO(), bson.M{
		"question":        reqData.Question,
		"responseOptions": reqData.ResponseOptions,
		"responses":       reqData.Responses,
		"expireAt":        reqData.ExpireAt,
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

type BadRequestResponse struct {
	Error string
}

func handleRequestPoll(
	res http.ResponseWriter,
	req *http.Request,
	coll *mongodb.Collection,
	pid string,
) {
	// Convert poll id string to proper ObjectID
	objId, err := primitive.ObjectIDFromHex(pid)
	if err != nil {
		log.Println("Failed to convert poll id to ObjectID", err)

		res.WriteHeader(http.StatusBadRequest)
		rawResponse := BadRequestResponse{
			Error: "Invalid poll id",
		}
		json.NewEncoder(res).Encode(rawResponse)
		return
	}

	// Create a Map with Object ID to query Mongo
	filter := bson.M{"_id": objId}
	pollRawRes := coll.FindOne(context.TODO(), filter)

	// Process the response and store in poll
	var poll Poll
	err = pollRawRes.Decode(&poll)

	if err != nil {
		res.WriteHeader(http.StatusBadRequest)
		log.Println("Failed to decode poll", pid)

		rawResponse := BadRequestResponse{
			Error: "Could not find requested poll",
		}
		json.NewEncoder(res).Encode(rawResponse)
		return
	}

	// Return poll data without duration
	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)

	rawResponse := struct {
		Question  string    `json:"question"`
		Options   [2]string `json:"options"`
		Responses [2]int    `json:"responses"`
		ExpireAt  time.Time `json:"expireAt"`
	}{
		poll.Question,
		poll.ResponseOptions,
		poll.Responses,
		poll.ExpireAt,
	}

	json.NewEncoder(res).Encode(rawResponse)
}
