# MVT Helper

This program's purpose is to help streamline the analysis of MVT videos. It consists of an timeline interface to annotate all events in the video. Upon completion, screenshots of all void events will be taken and stored. Annotation data can be saved as a .csv file, and metadata can be saved as a .json file.

## Requirements

Download [Git](https://git-scm.com/install/)

Download the latest version of [Node.js](https://nodejs.org/en/download)

Install [Python](https://www.python.org/downloads/). Make sure to add python to PATH.

## Installation and Setup

> These instuctions only need to be completed once.

Clone the repo into your desired location.

```bash
git clone https://github.com/rchdlee/MVT_helper.git
```

The application has the following general folder structure:

```
MVT_helper/ # main app
 ├─ backend/ # for taking screenshots + other utilities
 └─ frontend/ # annotation interface
```

Create Python Environment

```bash
# Make sure to replace `[path-to-MVT_HELPER-folder]`
cd [path-to-MVT_HELPER-folder]/backend # Navigate to backend folder
```

```bash
pip install pipenv # Install pipenv
pipenv install -r requirements.txt # Install packages
```

Install Frontend Packages

```bash
# Make sure to replace `[path-to-MVT_HELPER-folder]`
cd [path-to-MVT_HELPER-folder]/frontend # Navigate to frontend folder
```

```bash
npm install # Install packages
```

## Starting the application

We will create a script to start the application. Once completed, you can open the application by clicking on the start.bat or start.command file.

Windows:

1. Create a file called `start.bat` in the MVT_helper folder
2. Paste the following into the file, making sure to replace the [path-to-MVT_HELPER-folder] with the correct path

```bash
@echo off
start cmd /k "cd /d [path-to-MVT_HELPER-folder]\backend && pipenv run python app.py"
start cmd /k "cd /d [path-to-MVT_HELPER-folder]\frontend && npm run dev"
start chrome.exe "http://localhost:5173/"
```

Mac

1. Create a file called `start.command`in MVT_helper
2. Paste the following into the file, making sure to replace the [path-to-MVT_HELPER-folder] with the correct path

```bash
#!/bin/zsh

# --- Pre-cleanup: kill anything already on ports 5000 (backend) or 5173 (frontend) ---
echo "Cleaning up any old processes on ports 5000 and 5173..."
kill -9 $(lsof -t -i :5000 -sTCP:LISTEN 2>/dev/null) 2>/dev/null
kill -9 $(lsof -t -i :5173 -sTCP:LISTEN 2>/dev/null) 2>/dev/null

# Go to backend and start Python app
cd [path-to-MVT_helper_folder]/backend
pipenv run python main.py &

# Go to frontend and start dev server
cd [path-to-MVT_helper_folder]/frontend
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

3. Make the script executable. Make sure your working directory is the MVT_helper folder.

```bash
chmod +x start.command
```

Run the Script:

```bash
./start.bat # Windows
./start.command # Mac
```

# Usage

## Start

<img src="/images/start_20251125.PNG" width="300">

- On application start, you should be on the "Select Folder" tab.
- Make sure your video is .mp4 or .mov format. The browser is unable to work with .wmv files.
- Put the video file inside a folder. You can then select this folder and it will be loaded.
- If this is the first time you are analyzing this video, input mouse ID's.
- When you download the `metadata.json` file later, mouse ID information will be pre-filled.

## Annotator

![Screenshot of the MVT Helper main interface](/images/annotator_20251125.PNG)

> ⭐ = required

1. ⭐ Video Name
2. Metadata Fields. The metadata.json file can be downloaded after finishing.
3. ⭐ Start Time of the video (time displayed at bottom of video). Click the ⏪ icon to go to the first frame
4. ⭐ End Time of the video (time displayed at the bottom of video). Click the ⏩ icon to go to the last frame
5. Change Selected Event Type (void <-> leak)
6. Event Time - the time at which the void/leak happens. Click the 🖋 icon to change the time to the current video frame.
7. ⭐ Measure Time - the time at which you'd like to create a screenshot for the void. When a void event is created, select `Set Measure Time` to set the measure time at the current video frame. Once set, click the 🖋 icon to change the measure time to the current video frame. Required for all void events.
8. Type event location here.
9. Type event notes here.
10. Delete currently selected event (No undo)
11. Video time scroll
12. Zoom timeline in/out. R = reset zoom. Zoom can also be controlled by scrolling up/down
13. The annotator timeline. Mark all video events here. The mouse ID's you entered at the start screen should each have their own row. The (temporary) "Stats" row can be used to make a screenshot of calibration squares and to mark first mouse in/last mouse out
14. Example void event with measure time (blue)
15. Currently selected event (has circular handle on event marker)
16. The measure time of currently selected/hovered event
17. Example void event that still needs measure time info
18. Example leak event (does not have measure time category)
19. `V` button - Create a void event at the current video frame.
20. `L` button - Create a leak event at the current video frame.
21. Finish/Save

## Finish

Once submitted, screenshots will be populated in `MVT_helper > backend > screenshots` folder. Cut and paste this screenshots folder inside the video folder.

Event information will be stored in the generated CSV. Columns B-E of the CSV can be pasted into `MVT Template RL.xlsx`

Metadata about the video and mouse ID's will be stored in metadata.json. Move this into the video folder.
