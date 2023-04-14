package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"log"
	"net/http"
	"os"

	"image-worker/resize"
	"image-worker/sqsclient"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/sqs/types"
	"github.com/joho/godotenv"
)

func downloadFile(URL, fileName string) (image.Image, error) {
	//Get the response bytes from the url
	response, err := http.Get(URL)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	if response.StatusCode != 200 {
		return nil, errors.New("Received non 200 response code")
	}

	image, _, err := image.Decode(response.Body)
	if err != nil {
		return nil, err
	}

	return image, nil
}

func uploadToS3(key string, image bytes.Buffer) {
	//Creds to use
	accessId := os.Getenv("AWS_ACCESS_KEY_ID")
	secretKey := os.Getenv("AWS_SECRET_ACCESS_KEY")
	region := os.Getenv("AWS_REGION")
	bucket := os.Getenv("AWS_S3_BUCKET")

	s3Creds := credentials.NewStaticCredentialsProvider(accessId, secretKey, "")
	//queueURL := "https://sqs.us-west-2.amazonaws.com/436826798883/libari-image-resize-queue"
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithCredentialsProvider(s3Creds), config.WithRegion(region))
	if err != nil {
		log.Printf("error: %v", err)
		return
	}

	awsS3Client := s3.NewFromConfig(cfg)
	uploader := manager.NewUploader(awsS3Client)
	result, err := uploader.Upload(context.TODO(), &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
		Body:   &image,
	})
	if err != nil {
		log.Printf("error: %v", err)
	}
	fmt.Println(result)

}

func processMessage(message *types.Message) {

	//Grab data from SQS Message
	userIdAttr, ok := message.MessageAttributes["UserId"]
	if !ok {
		log.Fatal("userID couldn't be grabbed")
	}
	userId := aws.ToString(userIdAttr.StringValue)
	fmt.Println("UserId:", userId)

	if usernameAttr, ok := message.MessageAttributes["Username"]; ok {
		username := aws.ToString(usernameAttr.StringValue)
		fmt.Println("Username:", username)
	}

	if imageURLAttr, ok := message.MessageAttributes["ImageURL"]; ok {
		imageURL := aws.ToString(imageURLAttr.StringValue)
		fmt.Println("ImageURL:", imageURL)
		image, err := downloadFile(imageURL, fmt.Sprintf("%s.jpg", userId))
		if err != nil {
			fmt.Println("Couldn't download file: ", err)
		}

		newImageBuff, err := resize.Resize(image)

		uploadToS3(userId, newImageBuff)

	}

}

func main() {
	err := godotenv.Load()

	if err != nil {
		fmt.Println(err)
		log.Fatal("Error loading .env file")
	}
	queueName := "libari-image-resize-queue"

	sqsClient, err := sqsclient.New()
	if err != nil {
		fmt.Println("Error creating SQS client:", err)
		return
	}

	queueURL, err := sqsClient.GetQueueURL(context.Background(), queueName)
	if err != nil {
		fmt.Println("Error getting queue URL:", err)
		return
	}

	fmt.Println("Polling for messages from SQS: ", queueURL)
	for {
		messages, err := sqsClient.ReceiveMessages(context.Background(), queueURL)
		if err != nil {
			fmt.Println("Error receiving messages:", err)
			return
		}

		for _, message := range messages {
			go func() {
				processMessage(&message)
				sqsClient.DeleteMessage(queueURL, &message)
			}()
		}
	}
}
