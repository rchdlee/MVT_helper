import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const MiniTimeline = (props) => {
  const sliderChangeHandler = (e) => {
    props.onSliderChange(parseFloat(e));
  };

  const mouseDownHandler = () => {
    props.onMouseDown();
  };

  const mouseUpHandler = (e) => {
    props.onMouseUp(parseFloat(e));
  };

  return (
    <div className="w-full">
      <Slider
        min={0}
        max={0.999}
        step={0.001}
        value={props.videoState.playedFrac}
        onMouseDown={mouseDownHandler}
        onMouseUp={mouseUpHandler}
        onChange={sliderChangeHandler}
      />
    </div>
  );
};

export default MiniTimeline;
