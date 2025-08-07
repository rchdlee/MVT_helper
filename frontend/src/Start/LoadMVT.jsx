import { useState } from "react";
import { useCSVReader } from "react-papaparse";
import { v4 as uuidv4 } from "uuid";

import { loadCategories } from "../store/annotation-slice";
import { useDispatch } from "react-redux";

const LoadMVT = (props) => {
  const dispatch = useDispatch();

  const [csvIsUploaded, setCsvIsUploaded] = useState(false);
  const [csvResults, setCsvResults] = useState();
  const { CSVReader } = useCSVReader();

  const submitHandler = async () => {
    console.log("submitted", csvResults);

    // current CSV headers: [
    //     "Mouse", // 0
    //     "Type", // 1
    //     "Location", // 2
    //     "Note", // 3
    //     "Actual Event Time (s)", // 4
    //     "Actual Measure Time (s)", // 5
    //     "Video Event Time (s)", // 6
    //     "Video Measure Time (s)" // 7
    // ]

    const allEventCategories = csvResults.data.map((arr) => {
      return arr[0];
    });
    const uniqueEventCategories = [...new Set(allEventCategories)];
    const uniqueMouseIDs = uniqueEventCategories.filter(
      (cat) => cat !== "Mouse"
    );
    // .filter((cat) => cat !== "stats");

    const initialDataArr = uniqueMouseIDs.map((id) => {
      return {
        categoryName: id,
        events: [],
      };
    });

    const initialStateData = {
      data: [...initialDataArr],
    };
    //       {
    //         eventType: "void",
    //         eventTimeSec: 25,
    //         measureAtTimeSec: 200,
    //         eventID: "testid1a",
    //         location: "RBC",
    //         note: "my note",
    //       },

    for (let i = 1; i < csvResults.data.length; i++) {
      // skip header - index 0
      // console.log(csvResults.data[i]);

      // map category name to index in initialDataArr - this is a pretty bad way of doing it, should change later
      const rawEventData = csvResults.data[i];
      const index = uniqueMouseIDs.indexOf(rawEventData[0]);

      const eventID = uuidv4();

      const reduxEvent = {
        eventType: rawEventData[1],
        eventTimeSec: rawEventData[6],
        measureAtTimeSec: rawEventData[7],
        eventID: eventID,
        location: rawEventData[2],
        note: rawEventData[3],
      };

      initialStateData.data[index].events.push(reduxEvent);
    }

    console.log(initialStateData);
    dispatch(loadCategories(initialStateData));
    props.setIsAtStart(false);
  };

  return (
    <div>
      <div className="flex gap-2">
        <p className="w-24">Select Video:</p>
        <input
          type="file"
          onChange={props.handleFileUpload}
          className="border-[1px] block w-164"
        />
        {props.videoIsLoaded && <div>✔</div>}
      </div>
      <div className="flex gap-2">
        <p className="w-32">CSV File:</p>
        <CSVReader
          onUploadAccepted={(results) => {
            console.log("---------------------------");
            console.log(results);
            console.log("---------------------------");
            setCsvIsUploaded(true);
            setCsvResults(results);
          }}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }) => (
            <>
              <div className="flex mb-10 gap-2 border-[1px]">
                <button type="button" className="w-24" {...getRootProps()}>
                  Browse CSV
                </button>
                <div className="w-164 h-6 ">
                  {acceptedFile && acceptedFile.name}
                </div>
                <button {...getRemoveFileProps()} className="">
                  Remove
                </button>
                {csvIsUploaded && <p>✔</p>}
              </div>
              {/* <ProgressBar className="w-96" /> */}
            </>
          )}
        </CSVReader>
      </div>
      <div>
        <button className="border-2" onClick={submitHandler}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default LoadMVT;
