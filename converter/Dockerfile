# Dockerfile for WMV to MP4 converter
FROM ubuntu:22.04

# Set environment variables to avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install ffmpeg
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy the conversion script
COPY convert_wmv_to_mp4.sh.bak /app/convert_wmv_to_mp4.sh

# Make the script executable
RUN chmod +x /app/convert_wmv_to_mp4.sh

# Set the default command to run the script
ENTRYPOINT ["/app/convert_wmv_to_mp4.sh"]

# No default argument - user must provide input folder
CMD []
