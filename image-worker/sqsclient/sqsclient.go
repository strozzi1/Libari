package sqsclient

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
	"github.com/aws/aws-sdk-go-v2/service/sqs/types"
)

type SQSClient struct {
	Client *sqs.Client
}

func New() (*SQSClient, error) {
	cfg, err := config.LoadDefaultConfig(context.TODO())
	if err != nil {
		return nil, fmt.Errorf("unable to load SDK config: %v", err)
	}

	client := sqs.NewFromConfig(cfg)
	return &SQSClient{Client: client}, nil
}

func (s *SQSClient) GetQueueURL(ctx context.Context, queueName string) (string, error) {
	input := &sqs.GetQueueUrlInput{
		QueueName: aws.String(queueName),
	}

	result, err := s.Client.GetQueueUrl(ctx, input)
	if err != nil {
		return "", fmt.Errorf("error getting queue URL: %v", err)
	}

	return aws.ToString(result.QueueUrl), nil
}

func (s *SQSClient) ReceiveMessages(ctx context.Context, queueURL string) ([]types.Message, error) {
	input := &sqs.ReceiveMessageInput{
		QueueUrl: aws.String(queueURL),
		MessageAttributeNames: []string{
			string(types.QueueAttributeNameAll),
		},
		MaxNumberOfMessages: 10,
		VisibilityTimeout:   30,
		WaitTimeSeconds:     20,
	}

	resp, err := s.Client.ReceiveMessage(ctx, input)
	if err != nil {
		return nil, fmt.Errorf("error receiving messages: %v", err)
	}

	return resp.Messages, nil
}

//////////////////////

func (s *SQSClient) DeleteMessage(queueURL string, message *types.Message) {

	input := &sqs.DeleteMessageInput{
		QueueUrl:      aws.String(queueURL),
		ReceiptHandle: message.ReceiptHandle,
	}

	_, err := s.Client.DeleteMessage(context.Background(), input)
	if err != nil {
		fmt.Println("Error deleting message:", err)
		return
	}
	fmt.Println("message deleted")
}
