#!/bin/bash

# Pull the Docker image
docker pull divyanshia/automate:latest

# Stop any running container
docker stop my-stopwatch-app || true

# Remove the old container
docker rm my-stopwatch-app || true

# Run the new container
docker run -d -p 80:8080 --name my-stopwatch-app divyanshia/automate:latest
