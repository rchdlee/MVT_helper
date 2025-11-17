#!/bin/bash

cd "$(dirname "$0")"

echo "Starting app..."
docker compose up -d --build
open http://localhost:5173
echo "App is running in the background."
