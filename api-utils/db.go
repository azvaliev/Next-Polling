package utils

import (
	"context"
	"errors"
	"log"
	"os"
	"regexp"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const projectDirName = "next-polling"

func Db() (*mongo.Collection, error) {
	projectName := regexp.MustCompile(`^(.*` + projectDirName + `)`)
	currentWorkDirectory, _ := os.Getwd()
	rootPath := projectName.Find([]byte(currentWorkDirectory))

	if err := godotenv.Load(string(rootPath) + "/.env"); err != nil {
		log.Println("No .env file detected")
	}

	isDev := os.Getenv("DEV") == "true"
	uri := os.Getenv("MONGO_URL")
	if uri == "" {
		return nil, errors.New("missing MONGO_URL environment variable to connect to mongodb")
	}

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		return nil, err
	}

	var collName string
	if isDev {
		collName = "dev"
	} else {
		collName = "prod"
	}

	db := client.Database("next-polling")
	coll := db.Collection(collName)

	return coll, nil
}
