import { useRef } from "react";
import { useDispatch } from "react-redux";
import { setStartTimeIRL, setEndTimeIRL } from "./store/annotation-slice";

const UserInputs = (props) => {
  const filePathRef = useRef();
  const dispatch = useDispatch();

  const setStartTimeIRLHandler = (e) => {
    dispatch(setStartTimeIRL(e.target.value));
  };
  const setEndTimeIRLHandler = (e) => {
    dispatch(setEndTimeIRL(e.target.value));
  };

  return (
    <div className="">
      {/* <div className="bg-green-100">
        <h3>duration:{props.videoState.duration}</h3>
        <h3>playedSec:{props.videoState.playedSec}</h3>
        <h3>playedFrac:{props.videoState.playedFrac}</h3>
      </div> */}
      <div className="bg-pink-100 p-2">
        <div className="flex flex-col">
          <label htmlFor="parent_folder_path" className="text-sm pb-1">
            Full File Path
          </label>
          <input
            type="text"
            id="parent_folder_path"
            className="border-[1px] text-sm p-[2px]"
            onBlur={() => props.setFullPath(filePathRef.current.value)}
            ref={filePathRef}
          />
        </div>
        <div className="flex gap-1">
          <div>
            <div
              onClick={() => props.handleSeek(0)}
              className="group flex items-end gap-1 cursor-default"
            >
              <label
                htmlFor="video_start_time"
                className="text-sm group-hover:underline"
                // onClick={() => props.handleSeek(0)}
              >
                Start
              </label>
              <p>⏪</p>

              {/* <button onClick={() => props.handleSeek(0)}>Go to start</button> */}
            </div>
            <input
              type="text"
              id="video_start_time"
              className="border-[1px] text-sm p-[2px]"
              onBlur={setStartTimeIRLHandler}
              defaultValue={props.reduxState.startTimeIRL}
              placeholder="HH:MM:SS:mmm"
            />
          </div>
          <div>
            <div
              onClick={() => props.handleSeek(props.videoState?.duration)}
              className="group flex items-end gap-1"
            >
              <label
                htmlFor="video_end_time"
                className="text-sm group-hover:underline"
              >
                End
              </label>
              <p className="cursor-default">⏩</p>
              {/* <button
                onClick={() => props.handleSeek(props.videoState?.duration)}
              >
                Go to end
              </button> */}
            </div>
            <input
              type="text"
              id="video_end_time"
              className="border-[1px] text-sm p-[2px]"
              onBlur={setEndTimeIRLHandler}
              defaultValue={props.reduxState.endTimeIRL}
              placeholder="HH:MM:SS:mmm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInputs;
