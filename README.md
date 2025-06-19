# MVT Helper

This program's purpose is to help streamline the analysis of MVT videos.

## Requirements

Download the latest version of [Node.js](https://nodejs.org/en/download)

Install [Python](https://www.python.org/downloads/) if haven't done so already. Make sure to add python to PATH.

##

## Installation and Setup

Clone the repo into your desired location.

```bash
git clone https://github.com/rchdlee/MVT_helper.git
```

Create Python Environment (only needs to be done once)

```bash
cd [path-to-MVT_HELPER-folder]/backend # Navigate to backend folder
```

```bash
pip install pipenv # Install pipenv
```

```bash
pipenv install requirements.txt # Install packages
```

Install Frontend Packages (only needs to be done once)

```bash
cd [path-to-MVT_HELPER-folder]/frontend # Navigate to frontend folder
```

```bash
npm install # Install packages
```

## Starting the application

We will create a script to start the application.

Windows:

1. Create a file called `start.bat`
2. Paste the following into the file, making sure to replace the [] with the correct path

```bash
@echo off
start cmd /k "cd /d [path-to-MVT_HELPER-folder]\backend && pipenv run python app.py"
start cmd /k "cd /d [path-to-MVT_HELPER-folder]\frontend && npm run dev"
start chrome.exe "http://localhost:5173/" # opens in Google Chrome
```

Mac

1. Create a file called `start.sh`
2. Paste the following into the file, making sure to replace the [] with the correct path

```bash
#!/bin/bash
cd [path-to-MVT_HELPER-folder]/backend
pipenv run python app.py &

cd [path-to-MVT_HELPER-folder]/frontend
npm run dev &

open "http://localhost:5173/"

```

## Usage
