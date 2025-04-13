FROM golang:1.24 AS builder

WORKDIR /app

# Copy the entire project directory
COPY . .

# Download dependencies
RUN go mod download

# Build the binary
RUN CGO_ENABLED=0 go build -o main

FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/main .
RUN apk --no-cache add ca-certificates

EXPOSE 8080
CMD ["./main"]