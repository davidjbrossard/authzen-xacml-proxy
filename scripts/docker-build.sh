#!/bin/bash

# default image name (if not passed into script as env variable)
IMAGE=${IMAGE:-authzen-xacml-proxy}

docker build --tag ghcr.io/$package/$IMAGE .