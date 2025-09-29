# MVT Helper

This program's purpose is to help streamline the analysis of MVT videos.

## Requirements

Download the latest version of [Node.js](https://nodejs.org/en/download)

Install [Python](https://www.python.org/downloads/) if haven't done so already. Make sure to add python to PATH.

##

## Installation and Setup

> These instuctions only need to be completed once.

Clone the repo into your desired location.

```bash
git clone https://github.com/rchdlee/MVT_helper.git
```

Create Python Environment

```bash
cd [path-to-MVT_HELPER-folder]/backend # Navigate to backend folder
```

```bash
pip install pipenv # Install pipenv
```

```bash
pipenv install requirements.txt # Install packages
```

Install Frontend Packages

```bash
cd [path-to-MVT_HELPER-folder]/frontend # Navigate to frontend folder
```

```bash
npm install # Install packages
```

## Starting the application

We will create a script to start the application. This only needs to be done once. Once done, you only have to do the `Run the Script` command below

Windows:

1. Create a file called `start.bat` in MVT_helper
2. Paste the following into the file, making sure to replace the [] with the correct path

```bash
@echo off
start cmd /k "cd /d [path-to-MVT_HELPER-folder]\backend && pipenv run python app.py"
start cmd /k "cd /d [path-to-MVT_HELPER-folder]\frontend && npm run dev"
start chrome.exe "http://localhost:5173/"
```

Mac

1. Create a file called `start.sh`in MVT_helper
2. Paste the following into the file, making sure to replace the [] with the correct path

```bash
#!/bin/bash
cd [path-to-MVT_HELPER-folder]/backend
pipenv run python app.py &

cd [path-to-MVT_HELPER-folder]/frontend
npm run dev &

open "http://localhost:5173/"

```

```bash
#!/bin/zsh

# --- Pre-cleanup: kill anything already on ports 5000 (backend) or 5173 (frontend) ---
echo "Cleaning up any old processes on ports 5000 and 5173..."
kill -9 $(lsof -t -i :5000 -sTCP:LISTEN 2>/dev/null) 2>/dev/null
kill -9 $(lsof -t -i :5173 -sTCP:LISTEN 2>/dev/null) 2>/dev/null

# Make conda commands available in this non-interactive shell:
eval "$("$(conda info --base)"/bin/conda shell.zsh hook)"

# Go to backend and start Python app
cd [path-to-MVT_helper]/backend
conda activate MVT_helper
python3 app.py &

# Go to frontend and start dev server
cd [path-to-MVT_helper]/frontend
npm run dev &

# Open browser
open "http://localhost:5173/"

# --- Cleanup handling ---
cleanup() {
    echo "Stopping backend and frontend..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Keep script alive so trap can work
wait

```

Run the Script:

```bash
./start.bat # Windows
```

```bash
./start.sh # Mac
```

# Usage

## Start

- Select the video you want to analyze. If you copy the file path of the video here, it will save you some time next step.
- Input mouse names/IDs

## Annotator

![Screenshot of the MVT Helper main interface](/images/MVT_helper_screenshot.PNG)

> ⭐ = required

1. ⭐ Paste File Path here
2. ⭐ Start Time of the video (time displayed at bottom of video). Click the ⏪ icon to go to the first frame
3. ⭐ End Time of the video (time displayed at the bottom of video). Click the ⏩ icon to go to the last frame
4. Change Selected Event Type (void <-> leak)
5. Event Time - the time at which the void/leak happens. Click the 🖋 icon to change the time to the current video frame.
6. ⭐ Measure Time - the time at which you'd like to create a screenshot for the void. When a void event is created, select `Set Measure Time` to set the measure time at the current video frame. Once set, click the 🖋 icon to change the measure time to the current video frame. Required for all void events.
7. (temporary) "Stats" category. Use this timeline to make a screenshot of calibration squares and to mark first mouse in/last mouse out
8. `V` button - Create a void event at the current video frame.
9. `L` button - Create a leak event at the current video frame.
10. Zoom timeline in/out. R = reset zoom. Zoom can also be controlled by scrolling up/down
11. Example void event with all requried information (measure time)
12. Example leak event (does not have measure time category)
13. Currently selected event (has circle on event marker)
14. The measure time of currently selected/hovered event
15. Example void event that still needs measure time info
16. Click to generate screenshots at all void event measure times and to create a .csv file of event times.

## Finish

Once submitted, screenshots will be populated in `MVT_helper > backend > screenshots` folder

Event information will be stored in the generated CSV. Columns B-E of the CSV can be pasted into `MVT Template RL.xlsx`
