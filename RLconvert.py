import os
import subprocess
import sys
from pathlib import Path


def convert_wmv_to_mp4(parent_directory):
    path = Path(parent_directory)

    # Verify if the provided path exists and is a directory
    if not path.is_dir():
        print(f"Error: The path '{parent_directory}' is not a valid directory.")
        sys.exit(1)

    # Find all .wmv files (case-insensitive) in the directory
    wmv_files = list(path.glob("**/*.[wW][mM][vV]"))

    if not wmv_files:
        print(f"No .wmv files found in '{parent_directory}'.")
        return

    print(f"Found {len(wmv_files)} .wmv file(s) to convert.\n")

    for wmv_path in wmv_files:
        # Define the output path by changing the suffix to .mp4
        mp4_path = wmv_path.with_suffix(".mp4")

        # Skip if the .mp4 file already exists to prevent accidental overwrites
        if mp4_path.exists():
            print(f"Skipping: '{mp4_path.name}' already exists.")
            continue

        print(f"Converting: '{wmv_path.name}' -> '{mp4_path.name}'")

        # Build the FFmpeg command
        # -i: input file
        # -c:v libx264: encode video using H.264
        # -c:a aac: encode audio using AAC (highly compatible with MP4)
        # -crf 23: Constant Rate Factor (default quality setting, lower means better quality)
        command = [
            "ffmpeg",
            "-i",
            str(wmv_path),
            "-c:v",
            "libx264",
            "-crf",
            "23",
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            str(mp4_path),
        ]

        try:
            # Run the command. text=True and capture_output=True keeps the terminal clean,
            # but you can change it to check=True if you want to see full FFmpeg logs.
            subprocess.run(command, check=True, capture_output=True, text=True)
            print(f"Successfully converted: '{mp4_path.name}'")
        except subprocess.CalledProcessError as e:
            print(f"Failed to convert '{wmv_path.name}':")
            print(e.stderr)
        print("-" * 40)


if __name__ == "__main__":
    # Ensure the user provided the directory argument
    if len(sys.argv) < 2:
        print("Usage: python convert.py [path_to_parent_directory]")
        sys.exit(1)

    # Pass the command line argument to the function
    target_directory = sys.argv[1]
    convert_wmv_to_mp4(target_directory)