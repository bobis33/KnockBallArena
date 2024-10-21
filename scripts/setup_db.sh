#!/bin/bash

usage() {
  echo "Usage: $0 { up | down }"
  exit 1
}

if [ -z "$1" ]; then
  usage
fi

case "$1" in
  up)
    echo "Starting Docker Compose..."
    cd docker/ && docker-compose up -d
    ;;
  down)
    echo "Stopping Docker Compose..."
    cd docker/ && docker-compose down
    ;;
  *)
    usage
    ;;
esac
