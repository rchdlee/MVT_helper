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
import LoadSpinner from "./UI/LoadSpinner";

function App() {
  const playerRef = useRef();
  // //
  const [videoPath, setVideoPath] = useState(null);
  // const [videoPath, setVideoPath] = useState(testVideo);
  // //
  const [videoName, setVideoName] = useState(null);
  const [videoIsLoaded, setVideoIsLoaded] = useState(false);
  const [fullPath, setFullPath] = useState(null);
  // //
  const [isAtStart, setIsAtStart] = useState(true);
  // const [isAtStart, setIsAtStart] = useState(false);
  // //

  const [backendIsWorking, setBackendIsWorking] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

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

  // // HANDLERS // //
  const handleFileUpload = (e) => {
    setVideoPath(URL.createObjectURL(e.target.files[0]));
    setVideoIsLoaded(true);
    setVideoName(e.target.files[0].name);
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

  const submitAnnotationsHandler = async () => {
    console.log("submitting to backend", eventData);
    setBackendIsWorking(true);
    // check if all voids have a measure@ time

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

      // console.log("completed.", videoName.split(".")[0], timePointArray);
      try {
        const response = await axios.post("http://127.0.0.1:5000/capture", {
          // video_path: "/Users/leery/Documents/0xC/VAI4MVT/src/media/CohEF2/CohEF2_ER1a_L10-GFP_F_predtA_7-6-2020.mov" ,
          // video_path: videoName.split(".")[0],
          // video_path: "C:\\Users\\rlee21\\Documents\\CohEM3\\video1mp4.mp4",
          video_path: fullPath,
          // time_points: timePoints.split(',').map(Number),
          // time_points: [428, 428.1, 428.2,428.25,428.5,429, 12.4],
          time_points_arrays: timePointArray,
          // quadrant: "top-left",
          // crop_area: cropArea
        });

        // setScreenshots(response.data.screenshots);
        // setHasScreenshots(true);
        console.log("finished", response.data.screenshots);
        setBackendIsWorking(false);
        setIsAtEnd(true);
      } catch (error) {
        console.error("Error capturing screenshots:", error);
      }
      return;
    }
    console.log("UNFINISHED");
    return;
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
        />
      )}
      {/* {!isAtStart && !isAtEnd && ( */}
      {!isAtStart && (
        <div className="flex w-full h-screen gap-2 p-2">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-start h-full items-start">
            <div className="flex gap-2">
              <button onClick={backToStartHandler}>back</button>
              <p className="text-xs">{videoName}</p>
            </div>
            <ReactPlayer
              ref={playerRef}
              url={videoPath}
              // controls={true}
              playing={videoState.playing}
              // url={"https://www.youtube.com/watch?v=LXb3EKWsInQ"}
              // width="auto"
              // height="auto"
              height="90%"
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
                    className="cursor-pointer"
                  >
                    ⏸
                  </button>
                )}
                {!videoState.playing && (
                  <button
                    onClick={togglePlayStateHandler}
                    className="cursor-pointer"
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
            <div className="grow h-full flex flex-col justify-between">
              <div>
                <UserInputs
                  videoState={videoState}
                  handleSeek={handleSeek}
                  reduxState={reduxState}
                  setFullPath={setFullPath}
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
                  {backendIsWorking ? (
                    <div className="w-32 flex justify-center">
                      <LoadSpinner />
                    </div>
                  ) : (
                    <button
                      className="bg-purple-300"
                      onClick={submitAnnotationsHandler}
                    >
                      submit annotations
                    </button>
                  )}
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
