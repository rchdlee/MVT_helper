import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

const Scrollbar = (props) => {
  const gridSize = 20;

  const [timeoutID, setTimeoutID] = useState(null);
  const [containerWidth, setContainerWidth] = useState(null);
  const scrollbarContainerRef = useRef();

  useEffect(() => {
    setContainerWidth(scrollbarContainerRef?.current?.offsetWidth);
  });

  // // VARIABLES // //
  //   const containerWidth = scrollbarContainerRef?.current?.offsetWidth;
  const thumbWidth =
    ((props.timelineValueRange[1] - props.timelineValueRange[0]) /
      props.videoState.duration) *
    containerWidth;
  const thumbOffsetLeft =
    (props.timelineValueRange[0] / props.videoState.duration) * containerWidth;

  // // HANDLERS // //
  const dragStartHandler = () => {
    clearTimeout(timeoutID);
    props.setIsDraggingScrollBar(true);
  };
  const dragStopHandler = () => {
    const timeoutID = setTimeout(() => {
      props.setIsDraggingScrollBar(false);
    }, 1000);
    setTimeoutID(timeoutID);
  };
  const handleDrag = (e, data) => {
    const deltaX = data.deltaX;
    if (deltaX === 0 || Math.abs(deltaX) > gridSize + 1) {
      return;
    }
    const timeChange =
      (deltaX / (containerWidth - thumbWidth)) * props.videoState.duration;

    const tickInterval =
      props.videoState.duration / (props.zoomLevel * props.numberOfTicks);

    const newTicksEdit = [];

    if (
      props.timelineValueRange[1] === props.videoState.duration &&
      deltaX > -19
    ) {
      return;
    }

    props.setZoomTimelineTicks((prevState) => {
      const newTicksInit = prevState.map((time) => time + timeChange);

      if (props.videoState.playedSec > newTicksInit[props.numberOfTicks]) {
        props.seekTo(newTicksInit[props.numberOfTicks]);
        // if (props.currentlySelectedSegment) {
        //     props.escFunction();
        //   }
      }
      if (props.videoState.playedSec < newTicksInit[0]) {
        props.seekTo(newTicksInit[0]);
        // if (props.currentlySelectedSegment) {
        //   props.escFunction();
        // }
      }
      if (newTicksInit[0] < 0) {
        for (let i = 0; i <= props.numberOfTicks; i++) {
          newTicksEdit.push(i * tickInterval);
        }
        return newTicksEdit;
      }
      if (newTicksInit[props.numberOfTicks] > props.videoState.duration) {
        for (let i = 0; i <= props.numberOfTicks; i++) {
          newTicksEdit.push(
            props.videoState.duration + (i - props.numberOfTicks) * tickInterval
          );
        }
        return newTicksEdit;
      }
      return newTicksInit;
    });
  };

  return (
    <div
      className={`bg-gray-300 ${props.zoomLevel === 1 && "opacity-0"}`}
      ref={scrollbarContainerRef}
    >
      <div className="relative">
        <Draggable
          axis="x"
          bounds="parent"
          onStart={dragStartHandler}
          onStop={dragStopHandler}
          onDrag={handleDrag}
          grid={[gridSize, 0]}
          position={{ x: thumbOffsetLeft, y: 0 }}
        >
          <div
            className={`h-4 bg-gray-500`}
            style={{
              width: `${thumbWidth}px`,
            }}
          ></div>
        </Draggable>
      </div>
    </div>
  );
};

export default Scrollbar;
