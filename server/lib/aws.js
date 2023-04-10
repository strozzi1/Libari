import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import  { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
// Set the AWS Region.

import dotenv from 'dotenv'

dotenv.config()

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_S3_BUCKET_REGION;
const bucketName = process.env.AWS_S3_BUCKET;

const clientConfig = {
    region: region,
    credentials: {
        accessKeyId,
        secretAccessKey
    }
}

const s3Client = new S3Client(clientConfig)
const sqsClient = new SQSClient(clientConfig);



export function uploadFile(fileBuffer, fileName, mimetype) {
    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ContentType: mimetype
    }
    //console.log("uploadParams: ", uploadParams)

    return s3Client.send(new PutObjectCommand(uploadParams));
}

export function deleteFile(fileName) {
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
    }

    return s3Client.send(new DeleteObjectCommand(deleteParams));
}

//NO LONGER USEFUL
export const getObjectSignedUrl = async (key) => {
    
    const params = {
        Bucket: bucketName,
        Key: key
    }

// https://aws.amazon.com/blogs/developer/generate-presigned-url-modular-aws-sdk-javascript/
    const command = new GetObjectCommand(params);
    const seconds = 60 * 10 //10 minutes
    const url = await getSignedUrl(s3Client, command, { expiresIn: seconds });
    console.log("URL: ", url)
    return url
}


export const sendSQSMessage = async(params) => {
    //const messageCommand = new SendMessageCommand().
    console.log("sending to sqs")
    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
        return data; // For unit tests.
    } catch (err) {
        console.log("Error", err);
    }
}
