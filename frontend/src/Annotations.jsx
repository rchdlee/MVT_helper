import { useState } from "react";
import Slider from "rc-slider";

import { useSelector, useDispatch } from "react-redux";
import { testfunction } from "./store/annotation-slice";

import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";
import Scrollbar from "./Scrollbar";

const Annotations = (props) => {
  const dispatch = useDispatch();
  dispatch(testfunction());
  const DUMMY_ANNOTATIONS = [
    {
      id: "testid1",
      category: "mouse1",
      event_time_sec: 24.5,
      measure_at_time_sec: 135,
      type: "void",
    },
  ];

  const [zoom, setZoom] = useState(1);
  const zoomIncrement = 1;
  const numberOfTicks = 5;
  const initialTickInterval = props.videoState.duration / numberOfTicks;

  const [isDraggingScrollBar, setIsDraggingScrollBar] = useState(false);

  const initialTimelineTicks = [];
  const [zoomTimelineTicks, setZoomTimelineTicks] = useState([]);

  const timelineTicks = zoom === 1 ? initialTimelineTicks : zoomTimelineTicks;
  for (let i = 0; i <= numberOfTicks; i++) {
    initialTimelineTicks.push(i * initialTickInterval);
  }

  const timelineValueRange = [timelineTicks[0], timelineTicks[numberOfTicks]];

  const sliderFrac =
    (props.videoState.playedFrac * props.videoState.duration -
      timelineValueRange[0]) /
    (timelineValueRange[1] - timelineValueRange[0]);

  // // FUNCTIONS // //
  const calculateZoomTimelineTicks = (method, offset) => {
    // method: 'zoomin' or 'zoomout' or 'recalculate'
    // offset: on what timetick the slider handle is set to upon new zoom level

    let tickInterval;

    switch (method) {
      case "zoomin":
        tickInterval =
          props.videoState.duration / ((zoom + zoomIncrement) * numberOfTicks);
        break;
      case "zoomout":
        tickInterval =
          props.videoState.duration / ((zoom - zoomIncrement) * numberOfTicks);
        break;
      case "recalculate":
        tickInterval = props.videoState.duration / (zoom * numberOfTicks);
        break;
    }

    const zoomTimelineTicksTemp = [];
    const initialTime = props.videoState.playedSec - 4 * tickInterval;
    const finalTime = props.videoState.playedSec + 5 * tickInterval;

    if (initialTime < 0) {
      for (let i = 0; i <= numberOfTicks; i++) {
        zoomTimelineTicksTemp.push(i * tickInterval);
      }
      setZoomTimelineTicks(zoomTimelineTicksTemp);
    }
    if (finalTime > props.videoState.duration) {
      for (let i = 0; i <= numberOfTicks; i++) {
        zoomTimelineTicksTemp.push(
          (i - numberOfTicks) * tickInterval + props.videoState.duration
        );
        setZoomTimelineTicks(zoomTimelineTicksTemp);
      }
    }
    if (initialTime > 0 && finalTime < props.videoState.duration) {
      for (let i = 0; i <= numberOfTicks; i++) {
        zoomTimelineTicksTemp.push(
          props.videoState.playedSec + (i - offset) * tickInterval
        );
      }
      setZoomTimelineTicks(zoomTimelineTicksTemp);
    }
  };

  // add "RECALCULATE" functions (2) here

  // // HANDLERS // //
  const zoomOutHandler = () => {
    if (zoom > 1) {
      setZoom((prevState) => prevState - zoomIncrement);
      calculateZoomTimelineTicks("zoomout", 2);
    }
  };
  const zoomInHandler = () => {
    setZoom((prevState) => prevState + zoomIncrement);
    // calculateZoomInTimelineTicks();
    calculateZoomTimelineTicks("zoomin", 2);
  };
  const resetZoomHandler = () => {
    setZoom(1);
  };

  const sliderChangeHandler = (e) => {
    const playedFrac =
      (e * (timelineValueRange[1] - timelineValueRange[0]) +
        timelineValueRange[0]) /
      props.videoState.duration;
    props.onSliderChange(parseFloat(playedFrac));
  };
  const mouseDownHandler = () => {
    props.onMouseDown();
  };

  const mouseUpHandler = (e) => {
    const playedFrac =
      (e * (timelineValueRange[1] - timelineValueRange[0]) +
        timelineValueRange[0]) /
      props.videoState.duration;
    props.onMouseUp(parseFloat(playedFrac));
  };

  const addTimelineEventHandler = (e) => {
    const categoryName = e.target.id;
    const currentTime = props.videoState.playedSec;
    console.log(categoryName, currentTime);
  };

  // // JSX // //
  const timelineTicksJSX = timelineTicks.map((tick) => {
    if (timelineTicks[1] !== 0) {
      return (
        <div className="w-[1px] h-3 border-[1px] relative" key={tick}>
          <div className="absolute -top-2/1 -right-full text-xs">
            {secondsToMinAndSec(tick)}
          </div>
        </div>
      );
    }
  });

  // // // // // // // //
  // // // // // // // //
  return (
    <div className="w-full flex">
      <div className="">
        <div className="w-24 h-8">
          <button className="border-2 w-6 h-6" onClick={zoomOutHandler}>
            -
          </button>
          <button className="border-2 w-6 h-6" onClick={zoomInHandler}>
            +
          </button>
          <button className="border-2 w-6 h-6" onClick={resetZoomHandler}>
            R
          </button>
        </div>
        <div className="w-24 border-l-[1px] text-sm">
          <div className="h-8 border-y-[1px] flex gap-2">
            <p>mouse1</p>
            <button
              className="bg-green-300 px-2"
              id="mouse1"
              onClick={addTimelineEventHandler}
            >
              V
            </button>
          </div>
          <div className="h-8 border-b-[1px]">mouse2</div>
          <div className="h-8 border-b-[1px]">mouse3</div>
          <div className="h-8 border-b-[1px]">mouse4</div>
        </div>
      </div>
      <div className=" grow ">
        <div className="h-8 ">
          <div className="w-full">
            <div className="flex w-full justify-between">
              {/* <div className="w-[1px] h-3 border-[1px] relative">
                <div className="absolute -top-2/1 -right-full text-xs">
                  time1
                </div>
              </div> */}
              {timelineTicksJSX}
            </div>
            <Slider
              min={0}
              max={1}
              step={0.001}
              value={sliderFrac}
              onMouseDown={mouseDownHandler}
              onMouseUp={mouseUpHandler}
              onChange={sliderChangeHandler}
            />
          </div>
          {/* <p className="text-xs text-right">{props.videoTimeInfo}</p> */}
        </div>
        <div className="border-x-[1px]">
          <div className="border-y-[1px] h-8"></div>
          <div className="border-b-[1px] h-8"></div>
          <div className="border-b-[1px] h-8"></div>
          <div className="border-b-[1px] h-8"></div>
        </div>
        <Scrollbar
          isDraggingScrollBar={isDraggingScrollBar}
          setIsDraggingScrollBar={setIsDraggingScrollBar}
          timelineValueRange={timelineValueRange}
          videoState={props.videoState}
          zoomLevel={zoom}
          numberOfTicks={numberOfTicks}
          setZoomTimelineTicks={setZoomTimelineTicks}
          seekTo={props.seekTo}
        />
      </div>
    </div>
  );
};

export default Annotations;
