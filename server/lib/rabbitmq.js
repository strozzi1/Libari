import amqp from 'amqplib';

const rabbitmqHost = process.env.RABBITMQ_HOST || 'localhost';
const rabbitmqUrl = `amqp://${rabbitmqHost}`;

let connection = null;
let channel = null;

export const connectToRabbitMQ = async (queue) => {
    console.log(`Connecting to rabbitmqURL: ${rabbitmqUrl}`); //this prints
    try {
        connection = await amqp.connect(rabbitmqUrl);
        console.log(`Creating Channel`); //this doesn't print
        channel = await connection.createChannel();

        await channel.assertQueue(queue);
    } catch (err) {
        console.error('Failed to connect to RabbitMQ or create channel:', err);
    }
};

export const getChannel = () => {
    return channel;
};
/*
docker run -d --name rabbitmq-server \
    -p "5672:5672" \
    -p "15672:15672" \
    rabbitmq:3-management*/