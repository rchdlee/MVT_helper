import { useState, useRef } from "react";
import { useCSVReader } from "react-papaparse";
import axios from "axios";

const ScreenshotsCSV = (props) => {
  const [csvIsUploaded, setCsvIsUploaded] = useState(false);
  const [csvResults, setCsvResults] = useState();
  const { CSVReader } = useCSVReader();

  const [screenshotsCreated, setScreenshotsCreated] = useState(false);

  const filePathRef = useRef();

  const submitHandler = async () => {
    const timePointsString = csvResults.data[0];
    const timePoints = timePointsString.map((t) => {
      return +t;
    });
    const filePath = filePathRef.current.value;
    console.log("submitting csv", timePoints, filePath);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/capture_single",
        {
          video_path: filePath,
          time_points_array: timePoints,
        }
      );
      console.log(response);
      setScreenshotsCreated(true);
    } catch (error) {
      console.error("error capturing screenshots:", error);
    }
    return;
  };

  return (
    <div>
      <div className="flex gap-2">
        <p className="w-32">Full Video Path:</p>
        <input type="text" className="border-[1px] w-164" ref={filePathRef} />
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
            setScreenshotsCreated(false);
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
      {screenshotsCreated && (
        <div>
          <p>Screenshots have been created</p>
        </div>
      )}
    </div>
  );
};

export default ScreenshotsCSV;
