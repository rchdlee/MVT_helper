#!/bin/bash
cd "$(dirname "$0")" || exit 1

echo "Stopping application..."
docker compose down

echo "Application stopped."
read -p "Press Enter to close..."
