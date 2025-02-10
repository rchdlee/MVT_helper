import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios, { all } from "axios";
import ReactPlayer from "react-player";
import MiniTimeline from "./MiniTimeline";
import Start from "./Start";

import { useSelector } from "react-redux";

import testVideo from "./assets/video1mp4.mp4";

import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";
import Annotations from "./Annotations";
import EventInformation from "./EventInformation";

function App() {
  const playerRef = useRef();

  // const [videoPath, setVideoPath] = useState(null);
  const [videoPath, setVideoPath] = useState(testVideo);
  const [videoIsLoaded, setVideoIsLoaded] = useState(false);
  // const [isAtStart, setIsAtStart] = useState(true);
  const [isAtStart, setIsAtStart] = useState(false);

  const [selectedAnnotationIdentifiers, setSelectedAnnotationIdentifiers] =
    useState(null);

  const reduxState = useSelector((state) => state.annotation.data);

  const [videoState, setVideoState] = useState({
    playing: false,
    playedFrac: 0,
    playedSec: 0,
    seeking: false,
    duration: 0,
    playbackSpeed: 1,
  });

  // // HANDLERS // //
  const handleFileUpload = (e) => {
    setVideoPath(URL.createObjectURL(e.target.files[0]));
    setVideoIsLoaded(true);
  };

  const togglePlayStateHandler = () => {
    console.log("clicked play");
    setVideoState((prevState) => ({
      ...prevState,
      playing: !prevState.playing,
    }));
  };

  const handleSeek = (newTime) => {
    playerRef.current.seekTo(newTime);
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

  const submitAnnotationsHandler = () => {
    console.log("submitting to backend", reduxState);
    // check if all voids have a measure@ time

    let allVoidsHaveData = true;
    for (let i = 0; i < reduxState.length; i++) {
      for (let j = 0; j < reduxState[i].events.length; j++) {
        // console.log(
        //   "looping through",
        //   reduxState[i].events,
        //   "looking at this event:",
        //   reduxState[i].events[j]
        // );
        if (
          reduxState[i].events[j].eventType === "void" &&
          reduxState[i].events[j].measureAtTimeSec === null
        ) {
          // console.log(reduxState[i].events[j].eventID, "is not filled");
          allVoidsHaveData = false;
        }
      }
    }

    if (allVoidsHaveData) {
      console.log("completed.");
      return;
    }
    console.log("UNFINISHED");
    return;
  };

  // seek on scroll or arrow click

  ////
  //

  const videoTimeInfo = `${secondsToMinAndSec(
    videoState.playedSec
  )} / ${secondsToMinAndSec(videoState.duration)}`;

  return (
    <>
      {isAtStart && (
        <Start
          handleFileUpload={handleFileUpload}
          videoIsLoaded={videoIsLoaded}
          setIsAtStart={setIsAtStart}
        />
      )}
      {!isAtStart && (
        <div className="flex w-full h-screen gap-2 p-2">
          {/* LEFT SIDE */}
          <div className="flex flex-col justify-start h-full items-end">
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
            />
            <div className="w-full grow px-2">
              <div className="flex justify-center">
                <button
                  onClick={togglePlayStateHandler}
                  className="bg-blue-500"
                >
                  play/pause
                </button>
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
          <div className="grow h-full flex flex-col justify-between">
            {/* <input
              type="file"
              onChange={handleFileUpload}
              className="border-[1px] block"
            /> */}
            <div className="w-full">
              {/* <p>{selectedAnnotationIdentifiers?.eventID}</p> */}
              {/* <p>{selectedAnnotationIdentifiers?.categoryName}</p> */}
              {selectedAnnotationIdentifiers && (
                <EventInformation
                  selectedAnnotationIdentifiers={selectedAnnotationIdentifiers}
                  videoState={videoState}
                />
              )}
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
              />
              <button
                className="bg-purple-300"
                onClick={submitAnnotationsHandler}
              >
                submit annotations
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
