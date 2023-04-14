# Use the official Golang base image
FROM golang:1.19

# Set the working directory inside the container
WORKDIR /app

# Copy go.mod and go.sum files to the container's working directory
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the application
RUN go build -o main .

# Expose the port on which your microservice will run
EXPOSE 8080

# Run the compiled binary
CMD ["./main"]