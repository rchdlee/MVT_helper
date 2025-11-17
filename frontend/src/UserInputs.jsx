import { useRef } from "react";
import { useDispatch } from "react-redux";
import {
  setStartTimeIRL,
  setEndTimeIRL,
  setMetadataValue,
} from "./store/annotation-slice";
import Metadata from "./Metadata";

const UserInputs = (props) => {
  const filePathRef = useRef();
  const dispatch = useDispatch();
  const metadataRedux = props.reduxState.metadata;

  console.log(props.reduxState.metadata);

  const setStartTimeIRLHandler = (e) => {
    dispatch(setStartTimeIRL(e.target.value));
  };
  const setEndTimeIRLHandler = (e) => {
    dispatch(setEndTimeIRL(e.target.value));
  };

  const setMetadataHandler = (e) => {
    const category = e.target.id;
    const value = e.target.value;

    console.log(category, value);
    dispatch(
      setMetadataValue({
        category,
        value,
      })
    );
  };

  return (
    <div className="">
      {/* <div className="bg-green-100">
        <h3>duration:{props.videoState.duration}</h3>
        <h3>playedSec:{props.videoState.playedSec}</h3>
        <h3>playedFrac:{props.videoState.playedFrac}</h3>
      </div> */}
      <div className="bg-pink-100 p-2">
        {/* <div className="flex gap-2">
          <h3>Metadata</h3>
          <div className="flex gap-1">
            <p className="text-red-700">*</p>
            <p className="text-xs">= required</p>
          </div>
        </div> */}
        {/* <div className="flex flex-col">
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
        </div> */}
        <div className="flex gap-1 justify-between">
          <div className="flex flex-wrap gap-x-1">
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
                <p className="text-red-700">*</p>
                <p>⏪</p>

                {/* <button onClick={() => props.handleSeek(0)}>Go to start</button> */}
              </div>
              <input
                type="text"
                id="video_start_time"
                className="border-[1px] text-sm p-[2px]"
                onBlur={setStartTimeIRLHandler}
                // defaultValue={props.reduxState.startTimeIRL}
                defaultValue={props.reduxState.metadata.video_start_time}
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
                <p className="text-red-700">*</p>
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
                // defaultValue={props.reduxState.endTimeIRL}
                defaultValue={props.reduxState.metadata.video_end_time}
                placeholder="HH:MM:SS:mmm"
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="first_mouse_enter_time" className="text-xs">
                  First Mouse Enter Time
                </label>
              </div>
              <input
                type="text"
                id="first_mouse_enter_time"
                className="border-[1px] text-sm p-[2px]"
                placeholder="hh:mm:ss"
                defaultValue={metadataRedux.first_mouse_enter_time}
                onBlur={setMetadataHandler}
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="group" className="text-xs">
                  Group
                </label>
              </div>
              <input
                type="text"
                id="group"
                className="border-[1px] text-sm p-[2px]"
                placeholder="e.g., TeenF"
                defaultValue={metadataRedux.group}
                onBlur={setMetadataHandler}
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="cohort" className="text-xs">
                  Cohort
                </label>
              </div>
              <input
                type="text"
                id="cohort"
                className="border-[1px] text-sm p-[2px]"
                placeholder="e.g., TeenF2"
                defaultValue={metadataRedux.cohort}
                onBlur={setMetadataHandler}
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="date" className="text-xs">
                  MVT Date
                </label>
              </div>
              <input
                type="text"
                id="date"
                className="border-[1px] text-sm p-[2px]"
                placeholder="yyyymmdd"
                defaultValue={metadataRedux.date}
                onBlur={setMetadataHandler}
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="run" className="text-xs">
                  Run
                </label>
              </div>
              <input
                type="text"
                id="run"
                className="border-[1px] text-sm p-[2px]"
                placeholder="run"
                defaultValue={metadataRedux.run}
                onBlur={setMetadataHandler}
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="analyzed_date" className="text-xs">
                  Analyzed Date
                </label>
              </div>
              <input
                type="text"
                id="analyzed_date"
                className="border-[1px] text-sm p-[2px]"
                placeholder="yyyymmdd"
                defaultValue={metadataRedux.analyzed_date}
                onBlur={setMetadataHandler}
              />
            </div>
            <div className="">
              <div>
                <label htmlFor="analyzed_by" className="text-xs">
                  Analyzed By
                </label>
              </div>
              <input
                type="text"
                id="analyzed_by"
                className="border-[1px] text-sm p-[2px]"
                placeholder="initials"
                defaultValue={metadataRedux.analyzed_by}
                onBlur={setMetadataHandler}
              />
            </div>
          </div>

          {/* <div className="flex items-center hover:underline pr-8 pt-2">
            <button
              onClick={() =>
                props.setMetadataMenuIsOpen((prevState) => !prevState)
              }
            >
              Metadata
            </button>
          </div> */}
        </div>
      </div>
      {/* {props.metadataMenuIsOpen && (
        <Metadata
          setMetadataMenuIsOpen={props.setMetadataMenuIsOpen}
          reduxState={props.reduxState}
        />
      )} */}
    </div>
  );
};

export default UserInputs;
