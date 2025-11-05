import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setupCategories } from "../store/annotation-slice";
import StartTabs from "./StartTabs";
import NewMVT from "./NewMVT";
import ScreenshotsCSV from "./ScreenshotsCSV";
import LoadMVT from "./LoadMVT";
import SelectFolder from "./SelectFolder";

const Start = (props) => {
  // tabs for start screen: new_mvt, load_mvt, screenshot
  const [openTab, setOpenTab] = useState("select_folder");

  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();

  const dispatch = useDispatch();

  const switchTabsHandler = (tab) => {
    setOpenTab(tab);
    props.setVideoIsLoaded(false);
  };

  const continueHandler = () => {
    const inputValues = [
      input1.current.value,
      input2.current.value,
      input3.current.value,
      input4.current.value,
    ];

    let emptyInputIndices = [];
    for (let i = 0; i < 4; i++) {
      if (inputValues[i] === "") {
        emptyInputIndices.push(i);
      }
    }
    for (let i = emptyInputIndices.length - 1; i >= 0; i--) {
      inputValues.splice(emptyInputIndices[i], 1);
    }

    if (inputValues.length === 0 || !props.videoIsLoaded) {
      console.log("need at least one input value, or video was not selected");
      return;
    }

    dispatch(setupCategories(inputValues));
    props.setIsAtStart(false);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="mt-2">
        <div>
          <h1 className="font-bold text-xl">MVT Helper</h1>
        </div>
        <StartTabs
          openTab={openTab}
          // setOpenTab={setOpenTab}
          switchTabsHandler={switchTabsHandler}
        />
        {openTab === "select_folder" && (
          <SelectFolder
            input1={input1}
            input2={input2}
            input3={input3}
            input4={input4}
            videoIsLoaded={props.videoIsLoaded}
            handleFileUpload={props.handleFileUpload}
            continueHandler={continueHandler}
          />
        )}
        {openTab === "new_mvt" && (
          <NewMVT
            input1={input1}
            input2={input2}
            input3={input3}
            input4={input4}
            videoIsLoaded={props.videoIsLoaded}
            handleFileUpload={props.handleFileUpload}
            continueHandler={continueHandler}
          />
        )}
        {openTab === "load_mvt" && (
          <LoadMVT
            videoIsLoaded={props.videoIsLoaded}
            handleFileUpload={props.handleFileUpload}
            setIsAtStart={props.setIsAtStart}
          />
        )}
        {openTab === "screenshot" && <ScreenshotsCSV />}
      </div>
    </div>
  );
};

export default Start;
