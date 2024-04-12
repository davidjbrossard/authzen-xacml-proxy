#!/bin/bash

# default image name (if not passed into script as env variable)
IMAGE=${IMAGE:-authzen-proxy}

docker run --rm --env-file .env -d -p 8080:8080 --name $IMAGE ghcr.io/$package/$IMAGE
