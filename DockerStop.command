#!/bin/bash
echo "Stopping application..."

docker compose down

echo "Stopping Docker Desktop VM..."
osascript -e 'quit app "Docker"'

echo "Done."
