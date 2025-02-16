import { useDispatch } from "react-redux";
import { setStartTimeIRL, setEndTimeIRL } from "./store/annotation-slice";

const UserInputs = (props) => {
  const dispatch = useDispatch();

  const setStartTimeIRLHandler = (e) => {
    dispatch(setStartTimeIRL(e.target.value));
  };
  const setEndTimeIRLHandler = (e) => {
    dispatch(setEndTimeIRL(e.target.value));
  };

  return (
    <div className="">
      <div className="bg-green-100">
        <h3>duration:{props.videoState.duration}</h3>
        <h3>playedSec:{props.videoState.playedSec}</h3>
        <h3>playedFrac:{props.videoState.playedFrac}</h3>
      </div>
      <div className="bg-pink-100">
        <div>
          <label htmlFor="parent_folder_path">Parent Folder path</label>
          <input type="text" id="parent_folder_path" className="border-[1px]" />
        </div>
        <div>
          <div>
            <label htmlFor="video_start_time">Start Time (xx:xx:xx:xxx)</label>
            <button onClick={() => props.handleSeek(0)}>Go to start</button>
          </div>
          <input
            type="text"
            id="video_start_time"
            className="border-[1px]"
            onBlur={setStartTimeIRLHandler}
            defaultValue={props.reduxState.startTimeIRL}
          />
        </div>
        <div>
          <div>
            <label htmlFor="video_end_time">End Time (xx:xx:xx:xxx)</label>
            <button
              onClick={() => props.handleSeek(props.videoState?.duration)}
            >
              Go to end
            </button>
          </div>
          <input
            type="text"
            id="video_end_time"
            className="border-[1px]"
            onBlur={setEndTimeIRLHandler}
            defaultValue={props.reduxState.endTimeIRL}
          />
        </div>
      </div>
    </div>
  );
};

export default UserInputs;
