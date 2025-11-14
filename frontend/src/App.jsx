import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios, { all } from "axios";
import ReactPlayer from "react-player";
import MiniTimeline from "./MiniTimeline";
import Start from "./Start/Start";

import { useSelector, useDispatch } from "react-redux";
import {
  setStartTimeIRL,
  setEndTimeIRL,
  editEventTime,
  resetCategories,
} from "./store/annotation-slice";

import testVideo from "./assets/video1mp4.mp4";
import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";
import Annotations from "./Annotations";
import EventInformation from "./EventInformation";
import End from "./End";
import UserInputs from "./UserInputs";

function App() {
  const playerRef = useRef();
  // //
  const [videoPath, setVideoPath] = useState(null);
  const [video, setVideo] = useState(null);
  // const [videoPath, setVideoPath] = useState(testVideo);
  // //
  const [videoName, setVideoName] = useState(null);
  const [videoIsLoaded, setVideoIsLoaded] = useState(false);
  const [fullPath, setFullPath] = useState(null);

  const [loadedMetadata, setLoadedMetadata] = useState(null); // for pre-filling information when looking at a video that was already completed
  // //
  const [isAtStart, setIsAtStart] = useState(true);
  // const [isAtStart, setIsAtStart] = useState(false);
  // //

  const [backendIsProcessing, setBackendIsProcessing] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [backendHasError, setBackendHasError] = useState(false);

  const [metadataMenuIsOpen, setMetadataMenuIsOpen] = useState(false);

  const [zoom, setZoom] = useState(1);

  const [selectedAnnotationIdentifiers, setSelectedAnnotationIdentifiers] =
    useState(null);

  const dispatch = useDispatch();

  const reduxState = useSelector((state) => state.annotation);
  const eventData = useSelector((state) => state.annotation.data);

  const [videoState, setVideoState] = useState({
    playing: false,
    playedFrac: 0,
    playedSec: 0,
    seeking: false,
    duration: 0,
    playbackSpeed: 1,
  });

  // Alert user on page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Standard way to prompt the user for confirmation
      event.preventDefault();
      // For older browsers, assign a string to returnValue
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle spacebar for play/pause and arrow keys for seeking
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle keys when not in an input field
      if (
        event.target.tagName !== "INPUT" &&
        event.target.tagName !== "TEXTAREA"
      ) {
        if (event.code === "Space") {
          event.preventDefault(); // Prevent page scroll
          togglePlayStateHandler();
        } else if (event.code === "ArrowRight") {
          event.preventDefault(); // Prevent page scroll
          const currentTime = videoState.playedSec;
          const newTime = Math.min(currentTime + 5, videoState.duration);
          handleSeek(newTime);
        } else if (event.code === "ArrowLeft") {
          event.preventDefault(); // Prevent page scroll
          const currentTime = videoState.playedSec;
          const newTime = Math.max(currentTime - 5, 0);
          handleSeek(newTime);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoState.playing, videoState.playedSec, videoState.duration]); // Include dependencies

  // // HANDLERS // //
  const handleFileUpload = (e, isFolder = false, mp4File) => {
    let file;
    console.log(isFolder, mp4File);

    if (!isFolder) file = e.target.files[0]; // for when uploading the video itself
    if (isFolder) file = mp4File; // for when uploading a folder. mp4 file is sent in fn call from SelectFolder.jsx
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop().toLowerCase();

    // Check if it's a WMV file
    if (fileExtension === "wmv") {
      alert(
        "WMV files are not supported by most browsers. Please convert your WMV file to MP4 format for best compatibility.\n\nYou can use tools like FFmpeg or online converters to convert WMV to MP4."
      );
      return;
    }

    setVideoPath(URL.createObjectURL(file)); // currently using this for video URL for ReactPlayer
    setVideo(file); // this is the important one for new backend processing of screenshots without typing in video path
    setVideoIsLoaded(true);
    setVideoName(fileName);
  };

  const backToStartHandler = () => {
    setIsAtStart(true);
    dispatch(resetCategories());
  };

  const togglePlayStateHandler = () => {
    console.log("clicked play");
    setVideoState((prevState) => ({
      ...prevState,
      playing: !prevState.playing,
    }));
  };

  const handleSeek = (newTime) => {
    playerRef.current.seekTo(newTime, "seconds");
  };

  const handleVideoReady = () => {
    setVideoState((prevState) => ({
      ...prevState,
      duration: playerRef.current.getDuration(),
    }));
  };

  const updatePlayedFrac = (frac) => {
    setVideoState((prevState) => ({
      ...prevState,
      playedFrac: frac,
    }));

    playerRef.current.seekTo(frac);
  };

  const handleMouseDown = () => {
    setVideoState((prevState) => ({
      ...prevState,
      seeking: true,
    }));
  };

  const handleMouseUp = (value) => {
    setVideoState((prevState) => ({
      ...prevState,
      seeking: false,
    }));

    playerRef.current.seekTo(value);
  };

  const handleProgress = (state) => {
    const { loaded, loadedSeconds, played, playedSeconds } = state;

    if (!videoState.seeking) {
      setVideoState((prevState) => ({
        ...prevState,
        playedFrac: played,
        playedSec: playedSeconds,
      }));
    }
  };

  const setStartTimeIRLHandler = (e) => {
    dispatch(setStartTimeIRL(e.target.value));
  };
  const setEndTimeIRLHandler = (e) => {
    dispatch(setEndTimeIRL(e.target.value));
  };

  const checkStartEndTimeInputFormat = (time) => {
    if (time === null) {
      return false;
    }
    const splitTime = time.split(":");
    console.log(splitTime, "🎨");

    // check if all values for H:M:S:msec are there
    if (splitTime.length !== 4) {
      console.log("length is not 4");
      return false;
    }

    // check that there are 2 "digits" for the H:M:S and 3 "digits" for "msec"
    for (let i = 0; i < splitTime.length - 1; i++) {
      const n = splitTime[i];
      if (n.length !== 2) {
        console.log("H M or S is not 2 digits");
        return false;
      }
    }
    if (splitTime[splitTime.length - 1].length !== 3) {
      console.log("msec is not 3 digits");
      return false;
    }

    // //  check if all values are numbers
    for (let i = 0; i < splitTime.length; i++) {
      const n = +splitTime[i];
      console.log(n);
      if (Number.isNaN(n)) {
        console.log("there is a NaN value");
        return false;
      }
    }
    return true;
  };

  const submitAnnotationsHandler = async () => {
    console.log("submitting to backend", eventData);
    setBackendIsProcessing(true);

    const mouseIDs = eventData.map((obj) => {
      return obj.categoryName;
    });

    // console.log(mouseIDs);

    const startTimeIsCorrectFormat = checkStartEndTimeInputFormat(
      // reduxState.startTimeIRL
      reduxState.metadata.video_start_time
    );
    const endTimeIsCorrectFormat = checkStartEndTimeInputFormat(
      // reduxState.endTimeIRL
      reduxState.metadata.video_end_time
    );
    console.log(startTimeIsCorrectFormat, endTimeIsCorrectFormat);
    if (startTimeIsCorrectFormat !== true || endTimeIsCorrectFormat !== true) {
      console.log("NSEIRTNSRIE NOT CORRECT FORMAT");
      setPopupMessage(
        'Start or End Time is incorrectly formatted. Make sure it is in "HH:MM:SS:mmm" format'
      );
      setPopupIsOpen(true);
      return;
    }

    // // check if all voids have a measure@ time // //
    let allVoidsHaveData = true;
    for (let i = 0; i < eventData.length; i++) {
      for (let j = 0; j < eventData[i].events.length; j++) {
        // console.log(
        //   "looping through",
        //   eventData[i].events,
        //   "looking at this event:",
        //   eventData[i].events[j]
        // );
        if (
          eventData[i].events[j].eventType === "void" &&
          eventData[i].events[j].measureAtTimeSec === null
        ) {
          // console.log(eventData[i].events[j].eventID, "is not filled");
          allVoidsHaveData = false;
        }
      }
    }
    if (!allVoidsHaveData) {
      setPopupMessage('One or more void events do not have a "measure time"');
      setPopupIsOpen(true);
      console.log("unfinished measure time");
      return;
    }

    if (allVoidsHaveData) {
      const timePointArray = [];
      for (let i = 0; i < eventData.length; i++) {
        let arr = [];
        for (let j = 0; j < eventData[i].events.length; j++) {
          if (eventData[i].events[j].eventType === "void") {
            arr.push(eventData[i].events[j].measureAtTimeSec);
          }
        }
        timePointArray.push(arr);
      }

      console.log(fullPath, timePointArray, "🚄");
      setIsAtEnd(true);

      const formData = new FormData();
      formData.append("video", video);
      formData.append("time_points_arrays", JSON.stringify(timePointArray));
      formData.append("mouse_IDs", JSON.stringify(mouseIDs));

      // console.log("completed.", videoName.split(".")[0], timePointArray);
      try {
        const response = await axios.post(
          "http://localhost:5000/capture",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        // const response = await axios.post("http://127.0.0.1:5000/capture", {
        //   // video_path: "/Users/leery/Documents/0xC/VAI4MVT/src/media/CohEF2/CohEF2_ER1a_L10-GFP_F_predtA_7-6-2020.mov" ,
        //   // video_path: videoName.split(".")[0],
        //   // video_path: "C:\\Users\\rlee21\\Documents\\CohEM3\\video1mp4.mp4",
        //   video_path: fullPath,
        //   // time_points: timePoints.split(',').map(Number),
        //   // time_points: [428, 428.1, 428.2,428.25,428.5,429, 12.4],
        //   time_points_arrays: timePointArray,
        //   // quadrant: "top-left",
        //   // crop_area: cropArea,
        //   mouse_IDs: mouseIDs,
        // });

        // setScreenshots(response.data.screenshots);
        // setHasScreenshots(true);
        console.log("finished", response.data.screenshots);
        setBackendIsProcessing(false);
      } catch (error) {
        console.error("Error capturing screenshots:", error);
        setBackendHasError(true);
        setPopupMessage(
          "There was an error processing screenshots. The CSV is still good so please download it first. Then go back to the timeline and make sure the FULL video path is being passed in."
        );
        setPopupIsOpen(true);
        setBackendIsProcessing(false);
      }
      return;
    }
  };

  const closePopupHandler = () => {
    console.log("closing popup");
    setPopupMessage("");
    setPopupIsOpen(false);
  };

  //
  const handleVideoSeek = () => {
    console.log("seeking");
  };
  const handleVideoBuffer = () => {
    console.log("buffering");
  };
  ////
  //

  const videoTimeInfo = `${secondsToMinAndSec(
    videoState.playedSec
  )} / ${secondsToMinAndSec(videoState.duration)}`;

  return (
    <>
      {/* {isAtStart && !isAtEnd && ( */}
      {isAtStart && (
        <Start
          handleFileUpload={handleFileUpload}
          videoIsLoaded={videoIsLoaded}
          setVideoIsLoaded={setVideoIsLoaded}
          setIsAtStart={setIsAtStart}
          loadedMetadata={loadedMetadata}
          setLoadedMetadata={setLoadedMetadata}
        />
      )}
      {/* {!isAtStart && !isAtEnd && ( */}
      {!isAtStart && (
        <div className="flex w-full h-screen gap-2 p-2 relative">
          {/* ERROR POPUP */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 -translate-y-full transition-all duration-300 ${
              popupIsOpen ? "top-32" : "-top-64"
            } border-2 z-50 bg-white w-96 h-30 px-4 py-2 flex items-center justify-between gap-3 text-sm`}
          >
            <p className="font-semibold">ERROR:</p>
            <p>{popupMessage}</p>
            <button
              className="bg-red-400 px-2 w-6 h-6"
              onClick={closePopupHandler}
            >
              X
            </button>
          </div>
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-start h-full flex-1">
            <div className="flex gap-2 items-start w-full self-start">
              <button onClick={backToStartHandler}>back</button>
              <p className="text-xs">{videoName}</p>
            </div>
            <ReactPlayer
              ref={playerRef}
              url={videoPath}
              // controls={true}
              playing={videoState.playing}
              // url={"https://www.youtube.com/watch?v=LXb3EKWsInQ"}
              width="100%"
              // height="auto"
              height="85%"
              onReady={handleVideoReady}
              onProgress={handleProgress}
              onSeek={handleVideoSeek}
              onBuffer={handleVideoBuffer}
            />
            <div className="w-full grow px-2">
              <div className="flex justify-center">
                {videoState.playing && (
                  <button
                    onClick={togglePlayStateHandler}
                    // className="cursor-pointer text-4xl w-16 h-16 flex items-center justify-center hover:bg-gray-100 rounded"
                    className="cursor-pointer text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  >
                    ⏸
                  </button>
                )}
                {!videoState.playing && (
                  <button
                    onClick={togglePlayStateHandler}
                    // className="cursor-pointer text-4xl w-16 h-16 flex items-center justify-center hover:bg-gray-100 rounded"
                    className="cursor-pointer text-xl w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  >
                    ▶
                  </button>
                )}
              </div>
              <MiniTimeline
                videoState={videoState}
                onSliderChange={updatePlayedFrac}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
              />

              <p className="text-xs text-right">{videoTimeInfo}</p>
            </div>
          </div>
          {/* RIGHT SIDE */}
          {!isAtEnd && (
            <div className="w-[600px] h-full flex flex-col justify-between">
              {/* <div className="w-[800px] h-full flex flex-col justify-between"> */}
              <div>
                <UserInputs
                  videoState={videoState}
                  handleSeek={handleSeek}
                  reduxState={reduxState}
                  setFullPath={setFullPath}
                  metadataMenuIsOpen={metadataMenuIsOpen}
                  setMetadataMenuIsOpen={setMetadataMenuIsOpen}
                />

                <div className="w-full">
                  {selectedAnnotationIdentifiers && (
                    <EventInformation
                      selectedAnnotationIdentifiers={
                        selectedAnnotationIdentifiers
                      }
                      setSelectedAnnotationIdentifiers={
                        setSelectedAnnotationIdentifiers
                      }
                      videoState={videoState}
                      seekTo={handleSeek}
                    />
                  )}
                </div>
              </div>

              <div>
                <Annotations
                  videoTimeInfo={videoTimeInfo}
                  videoState={videoState}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onSliderChange={updatePlayedFrac}
                  seekTo={handleSeek}
                  selectedAnnotationIdentifiers={selectedAnnotationIdentifiers}
                  setSelectedAnnotationIdentifiers={
                    setSelectedAnnotationIdentifiers
                  }
                  zoom={zoom}
                  setZoom={setZoom}
                  playerRef={playerRef}
                  isAtStart={isAtStart}
                  isAtEnd={isAtEnd}
                />
                <div className="w-full flex justify-end">
                  {/* {backendIsProcessing ? (
                    <div className="w-32 flex justify-center">
                      <LoadSpinner />
                    </div>
                  ) : ( */}
                  <button
                    className="bg-purple-300"
                    onClick={submitAnnotationsHandler}
                  >
                    submit annotations
                  </button>
                  {/* )} */}
                </div>
              </div>
            </div>
          )}
          {isAtEnd && (
            <End
              setIsAtEnd={setIsAtEnd}
              data={reduxState}
              videoState={videoState}
              videoName={videoName}
              seekTo={handleSeek}
              backendIsProcessing={backendIsProcessing}
              setZoom={setZoom}
              backendHasError={backendHasError}
              setBackendHasError={setBackendHasError}
            />
          )}
        </div>
      )}
      {/* {!isAtStart && isAtEnd && (
        <End
          setIsAtEnd={setIsAtEnd}
          data={reduxState}
          videoState={videoState}
        />
      )} */}
    </>
  );
}

export default App;
