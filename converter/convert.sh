#!/bin/bash

# Script to run the WMV to MP4 converter container
# Usage: ./run_converter.sh <input_folder>

# Check if input parameter is provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide a folder path as input parameter"
    echo "Usage: $0 <input_folder>"
    echo ""
    echo "Examples:"
    echo "  $0 /path/to/your/wmv/files"
    echo "  $0 ../videos"
    echo "  $0 ~/Downloads/videos"
    exit 1
fi

# Get the input folder path
INPUT_FOLDER="$1"

# Check if the input folder exists
if [ ! -d "$INPUT_FOLDER" ]; then
    echo "Error: Folder '$INPUT_FOLDER' does not exist"
    exit 1
fi

# Get the absolute path of the input folder
ABS_INPUT_FOLDER=$(cd "$INPUT_FOLDER" && pwd)

echo "WMV to MP4 Converter"
echo "===================="
echo "Input folder: $ABS_INPUT_FOLDER"
echo "Output folder: $ABS_INPUT_FOLDER/mp4"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed or not in PATH"
    echo "Please install Docker Compose first"
    exit 1
fi

# Check if we're in the converter directory
if [ ! -f "docker-compose.yml" ]; then
    echo "Error: docker-compose.yml not found"
    echo "Please run this script from the converter directory"
    exit 1
fi

echo "Starting conversion..."
echo "----------------------------------------"

# Run the container with the specified input folder
docker-compose run --rm -v "$ABS_INPUT_FOLDER:/app/input" wmv-converter /app/input

echo ""
echo "Conversion completed!"
echo "Check the 'mp4' folder in your input directory for converted files."
