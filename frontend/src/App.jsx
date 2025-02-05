import { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import ReactPlayer from "react-player";
import MiniTimeline from "./MiniTimeline";

import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";
import Annotations from "./Annotations";

function App() {
  const playerRef = useRef();

  const [videoPath, setVideoPath] = useState(null);
  const [videoIsLoaded, setVideoIsLoaded] = useState(false);

  const handleFileUpload = (e) => {
    setVideoPath(URL.createObjectURL(e.target.files[0]));
  };

  //
  // VIDEO STATE
  const [videoState, setVideoState] = useState({
    playing: false,
    playedFrac: 0,
    playedSec: 0,
    seeking: false,
    duration: 0,
    playbackSpeed: 1,
  });
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
  ////
  //

  const videoTimeInfo = `${secondsToMinAndSec(
    videoState.playedSec
  )} / ${secondsToMinAndSec(videoState.duration)}`;

  return (
    <>
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
              <button onClick={togglePlayStateHandler} className="bg-blue-500">
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
          <input
            type="file"
            onChange={handleFileUpload}
            className="border-[1px] block"
          />
          <div className="w-full"></div>

          <Annotations
            videoTimeInfo={videoTimeInfo}
            videoState={videoState}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onSliderChange={updatePlayedFrac}
            seekTo={handleSeek}
          />
        </div>
      </div>
    </>
  );
}

export default App;
