import { useState, useEffect, useRef } from "react";
import Slider from "rc-slider";

import { v4 as uuidv4 } from "uuid";

import { useSelector, useDispatch } from "react-redux";
import { addNewEvent } from "./store/annotation-slice";

import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";
import Scrollbar from "./Scrollbar";

import { useKeyPress } from "./helpers/useKeyPress";

const Annotations = (props) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state.annotation.data);
  //   console.log(reduxState);

  const timelineContainerRef = useRef();
  const [timelineContainerWidth, setTimelineContainerWidth] = useState(null);
  useEffect(() => {
    setTimelineContainerWidth(timelineContainerRef?.current?.offsetWidth);
  }, []);

  const zoomIncrement = 1;
  const numberOfTicks = 5;
  const initialTickInterval = props.videoState.duration / numberOfTicks;

  const [isDraggingScrollBar, setIsDraggingScrollBar] = useState(false);

  const initialTimelineTicks = [];
  const [zoomTimelineTicks, setZoomTimelineTicks] = useState([]);

  const timelineTicks =
    props.zoom === 1 ? initialTimelineTicks : zoomTimelineTicks;
  for (let i = 0; i <= numberOfTicks; i++) {
    initialTimelineTicks.push(i * initialTickInterval);
  }

  const timelineValueRange = [timelineTicks[0], timelineTicks[numberOfTicks]];

  // const [sliderFrac, setSliderFrac] = useState(
  //   (props.videoState.playedFrac * props.videoState.duration -
  //     timelineValueRange[0]) /
  //     (timelineValueRange[1] - timelineValueRange[0])
  // );
  const sliderFrac =
    (props.videoState.playedFrac * props.videoState.duration -
      timelineValueRange[0]) /
    (timelineValueRange[1] - timelineValueRange[0]);

  // // FUNCTIONS // //
  const calculateZoomTimelineTicks = (method, offset) => {
    // method: 'zoomin' or 'zoomout' or 'recalculate'
    // offset: on what timetick the slider handle is set to upon new props.zoom level

    let tickInterval;

    switch (method) {
      case "zoomin":
        tickInterval =
          props.videoState.duration /
          // ((props.zoom + zoomIncrement) * numberOfTicks);
          (props.zoom * 2 * numberOfTicks);
        break;
      case "zoomout":
        tickInterval =
          props.videoState.duration /
          // ((props.zoom - zoomIncrement) * numberOfTicks);
          ((props.zoom / 2) * numberOfTicks);
        break;
      case "recalculate":
        tickInterval = props.videoState.duration / (props.zoom * numberOfTicks);
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
    if (props.zoom > 1) {
      // props.setZoom((prevState) => prevState - zoomIncrement);
      props.setZoom((prevState) => prevState / 2);
      calculateZoomTimelineTicks("zoomout", 2);
    }
  };
  const zoomInHandler = () => {
    // props.setZoom((prevState) => prevState + zoomIncrement);
    props.setZoom((prevState) => prevState * 2);
    // calculateZoomInTimelineTicks();
    calculateZoomTimelineTicks("zoomin", 2);
  };
  const resetZoomHandler = () => {
    props.setZoom(1);
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

  const scrollZoomHandler = (e) => {
    // console.log("scrolling", e);
    if (props.isAtStart || props.isAtEnd) {
      return;
    }
    if (e.deltaY < 0) {
      zoomInHandler();
    }
    if (e.deltaY > 0) {
      zoomOutHandler();
    }
  };

  useEffect(() => {
    document.addEventListener("wheel", scrollZoomHandler, false);

    return () => {
      document.removeEventListener("wheel", scrollZoomHandler, false);
    };
  }, [scrollZoomHandler]);

  // KEY PRESS DETECTION FOR ZOOM //

  useKeyPress(["-", "="], (key) => {
    if (key === "-") {
      // console.log("Minus key pressed!");
      zoomOutHandler();
    } else if (key === "=") {
      // console.log("Equals key pressed!");
      zoomInHandler();
    }
  });

  const addTimelineEventHandler = (e, type) => {
    console.log(e, type);
    const categoryName = e.target.id;
    const currentTime = props.videoState.playedSec;
    const eventID = uuidv4();
    // console.log(categoryName, currentTime);

    dispatch(
      addNewEvent({
        eventType: type,
        eventTime: currentTime,
        category: categoryName,
        eventID: eventID,
      })
    );

    props.setSelectedAnnotationIdentifiers({
      categoryName: categoryName,
      eventID: eventID,
    });

    // console.log(test, "🌹");
  };

  const annotationClickHandler = (e) => {
    console.log("clicked annotation id", e.target.closest("button").id, "🚕");
    const annotationInformation = e.target.closest("button").id.split("_");
    const categoryName = annotationInformation[0];
    const eventID = annotationInformation[1];
    // // setting to null first because 'note' and 'location' inputs are not resetting to defaultValue. need to fix
    // props.setSelectedAnnotationIdentifiers(null);
    props.setSelectedAnnotationIdentifiers({
      categoryName: categoryName,
      eventID: eventID,
    });

    const annotationDataFromRedux = reduxState
      .filter((cat) => {
        return cat.categoryName === categoryName;
      })[0]
      .events.filter((event) => {
        return event.eventID === eventID;
      })[0];
    console.log(annotationDataFromRedux, annotationDataFromRedux.eventTime);

    props.seekTo(annotationDataFromRedux.eventTimeSec);
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

  const annotationCategoryHeadersJSX = reduxState.map((cat) => {
    return (
      <div
        className="h-8 border-y-[1px] flex gap-2 items-center"
        key={cat.categoryName}
      >
        <p className="text-xs">{cat.categoryName}</p>
        <div className="flex gap-1">
          <button
            className="bg-green-300 px-[6px]"
            id={cat.categoryName}
            onClick={(e) => addTimelineEventHandler(e, "void")}
          >
            V
          </button>
          <button
            className="bg-yellow-500 px-[6px]"
            id={cat.categoryName}
            onClick={(e) => addTimelineEventHandler(e, "leak")}
          >
            L
          </button>
        </div>
      </div>
    );
  });

  //   console.log(reduxState);

  const annotationsJSX = reduxState.map((cat, index) => {
    return (
      <div
        className={`h-8 relative flex ${
          index === 0 ? "border-y-[1px]" : "border-b-[1px]"
        }`}
        key={cat.categoryName}
      >
        {/* {console.log(cat.events, index, "tsratsra", timelineValueRange)} */}
        {cat.events
          .filter((event) => {
            return (
              event.eventTimeSec > timelineValueRange[0] &&
              event.eventTimeSec < timelineValueRange[1]
              // need to add some sort of statement so that even if only measureAtTime
              // is in the timeline range it still shows up.
              // or maybe even make it a separate map function
            );
          })
          .map((event) => {
            const eventOffsetLeft =
              ((event.eventTimeSec - timelineValueRange[0]) /
                props.videoState.duration) *
              timelineContainerWidth *
              props.zoom;

            const measureAtTimeInRange =
              event.measureAtTimeSec > timelineValueRange[0] &&
              event.measureAtTimeSec < timelineValueRange[1];

            const measureAtTimeOffsetLeftFromEventTime =
              ((event.measureAtTimeSec - event.eventTimeSec) /
                //  -
                // timelineValueRange[0]
                props.videoState.duration) *
              timelineContainerWidth *
              props.zoom;

            // event type:
            // void -> if has measureattime, set color (blue)
            // void -> if doesnt have measureat time, set color (red)
            // leak -> set color (orange)
            const isVoid = event.eventType === "void";
            const isLeak = event.eventType === "leak";

            const voidDataIsComplete =
              isVoid && event.measureAtTimeSec !== null;

            let color;
            let width;
            if (isVoid && voidDataIsComplete) {
              color = "bg-blue-400 z-50";
              width = "w-[4px]";
            }
            if (isVoid && !voidDataIsComplete) {
              color = "bg-red-500 z-50";
              width = "w-[4px]";
            }
            if (isLeak) {
              color = "bg-orange-400";
              width = "w-[2px]";
            }

            return (
              //   <div>
              <button
                key={event.eventID}
                className={`${color} ${width} h-full absolute group`}
                style={{
                  left: `${eventOffsetLeft}px`,
                }}
                onClick={annotationClickHandler}
                id={`${cat.categoryName}_${event.eventID}`}
              >
                <div className="w-full h-full flex relative">
                  <div
                    className={`w-3 h-3 ${color}     
                    rounded-full absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 ${
                      props.selectedAnnotationIdentifiers?.eventID ===
                      event.eventID
                        ? "opacity-100"
                        : "opacity-0"
                    } opacity-0 group-hover:opacity-100`}
                  ></div>
                  {measureAtTimeInRange && (
                    <div
                      className={`absolute w-[2px] h-full bg-black ${
                        props.selectedAnnotationIdentifiers?.eventID ===
                        event.eventID
                          ? "opacity-100"
                          : "opacity-0"
                      } group-hover:opacity-100`}
                      style={{
                        left: `${measureAtTimeOffsetLeftFromEventTime}px`,
                      }}
                    ></div>
                  )}
                </div>
              </button>
              //   </div>
            );
          })}
      </div>
    );
  });

  // // // // // // // //
  // // // // // // // //
  return (
    <div className="w-full flex" id="annotation parent container">
      <div className="">
        <div className="w-24 h-8">
          <button
            className="bg-slate-200 hover:bg-slate-300 w-6 h-6 mr-1"
            onClick={resetZoomHandler}
          >
            R
          </button>
          <button
            className="bg-slate-200 hover:bg-slate-300 w-6 h-6 mr-1"
            onClick={zoomOutHandler}
          >
            -
          </button>
          <button
            className="bg-slate-200 hover:bg-slate-300 w-6 h-6 mr-1"
            onClick={zoomInHandler}
          >
            +
          </button>
        </div>
        <div className="w-24 border-l-[1px] text-sm">
          {annotationCategoryHeadersJSX}
        </div>
      </div>
      <div className=" grow ">
        <div className="h-8" ref={timelineContainerRef}>
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
        <div className="border-x-[1px]" id="annotations">
          {/* <div className="border-y-[1px] h-8"></div>
          <div className="border-b-[1px] h-8"></div>
          <div className="border-b-[1px] h-8"></div>
          <div className="border-b-[1px] h-8"></div> */}
          {annotationsJSX}
        </div>
        <Scrollbar
          isDraggingScrollBar={isDraggingScrollBar}
          setIsDraggingScrollBar={setIsDraggingScrollBar}
          timelineValueRange={timelineValueRange}
          videoState={props.videoState}
          zoomLevel={props.zoom}
          numberOfTicks={numberOfTicks}
          setZoomTimelineTicks={setZoomTimelineTicks}
          seekTo={props.seekTo}
        />
      </div>
    </div>
  );
};

export default Annotations;
