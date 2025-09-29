# WMV to MP4 Converter

This Docker container provides a simple way to convert WMV files to MP4 format using ffmpeg.

## Quick Start

1. **Run the converter** (easiest way):
   ```bash
   cd converter
   ./convert.sh /path/to/your/wmv/files
   ```

2. **That's it!** The converted MP4 files will be saved in a `mp4` folder within your input directory.

## Features

- Converts all WMV files in a specified folder to MP4 format
- Creates an `mp4` subfolder for output files
- Skips files that already have MP4 equivalents
- Uses optimized ffmpeg settings for quality and compatibility

## Usage Examples

```bash
# Convert files in the videos directory
./convert.sh ../videos

# Convert files in Downloads
./convert.sh ~/Downloads/videos

# Convert files in any directory
./convert.sh /path/to/your/wmv/files
```

## Files in this folder

- `convert.sh` - **Main script to run the converter** (use this one!)
- `convert_wmv_to_mp4.sh.bak` - Internal conversion script (copied into Docker container)
- `Dockerfile` - Docker image definition
- `docker-compose.yml` - Docker Compose configuration
- `README.md` - This documentation

## Advanced Usage

### Using Docker Compose (Manual)

1. Build the image:
```bash
cd converter
docker-compose build
```

2. Run the converter with your input folder:
```bash
# Convert files in a specific directory
docker-compose run --rm -v /path/to/your/wmv/files:/app/input wmv-converter /app/input

# Convert files in the videos directory
docker-compose run --rm -v ../videos:/app/input wmv-converter /app/input
```

### Using Docker directly

1. Build the image:
```bash
cd converter
docker build -t wmv-converter .
```

2. Run the converter:
```bash
# Convert files in a specific directory
docker run --rm -v /path/to/your/wmv/files:/app/input wmv-converter /app/input

# Convert files in the videos directory
docker run --rm -v ../videos:/app/input wmv-converter /app/input
```

### Interactive mode

To run the container interactively and see real-time output:
```bash
docker run --rm -it -v /path/to/your/wmv/files:/app/input wmv-converter /app/input
```

## Output

- Converted MP4 files will be saved in a `mp4` subfolder within your input directory
- The script provides progress feedback and a summary of processed/skipped files
- Failed conversions are logged and partial files are cleaned up

## Requirements

- Docker installed on your system
- WMV files in the input directory
- Sufficient disk space for MP4 output files

## Example

If you have WMV files in `/home/user/videos/`, the converted MP4 files will be saved to `/home/user/videos/mp4/`.
