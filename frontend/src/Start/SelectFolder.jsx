import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCategories,
  loadMetadata,
  setMetadataValue,
  setupCategories,
} from "../store/annotation-slice";

import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";

const SelectFolder = (props) => {
  const dispatch = useDispatch();

  const [folderName, setFolderName] = useState(null);
  const [mp4FileName, setMp4FileName] = useState(null);
  const [metadataFileExists, setMetadataFileExists] = useState(false);
  const [csvFileExists, setCsvFileExists] = useState(false);
  const [csvFileData, setCsvFileData] = useState(null);

  const handleFolderUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const folderName = files[0].webkitRelativePath.split("/")[0];

    const mp4File = files.find((f) => f.name.toLowerCase().endsWith(".mp4"));
    const metadataFile = files.find((f) =>
      f.name.toLowerCase().includes("metadata.json")
    );
    const csvFile = files.find(
      (f) => f.name.toLowerCase().includes(`_eventdata.csv`)
      // f.name.toLowerCase().includes(`${mp4File.name}_eventdata.csv`)
    );

    // console.log(files, mp4File, metadataFile, csvFile);

    // handle upload of mp4 file if it exists
    if (mp4File) {
      console.log("mp4 file was found.");
      setFolderName(folderName);
      props.handleFileUpload(e, true, mp4File);
      setMp4FileName(mp4File.name);
    } else {
      console.log("No mp4 file found in folder.");
      alert("No .mp4 file was found in the folder.");
      return;
    }

    // parse metadata file if it exists and fill out mouse ID's
    let mouseIDs; // for csv parsing
    if (metadataFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          // props.setLoadedMetadata(jsonData);

          dispatch(loadMetadata({ metadata: jsonData }));

          console.log(jsonData);

          mouseIDs = jsonData.mice;
          if (mouseIDs[0]) props.input1.current.value = mouseIDs[0];
          if (mouseIDs[1]) props.input2.current.value = mouseIDs[1];
          if (mouseIDs[2]) props.input3.current.value = mouseIDs[2];
          if (mouseIDs[3]) props.input4.current.value = mouseIDs[3];
          setMetadataFileExists(true);
        } catch (err) {
          console.error("Error parsing JSON file", err);
        }
      };
      reader.readAsText(metadataFile);
    } else {
      console.log("metadata.json was not found in folder");
      // props.setLoadedMetadata(null);
      // return;
    }

    if (!metadataFile) {
      const mouseInputValuesRaw = [
        props.input1.current.value,
        props.input2.current.value,
        props.input3.current.value,
        props.input4.current.value,
      ];
      const mouseInputValues = mouseInputValuesRaw.filter(Boolean);
      console.log("setting mouseIDs", mouseInputValues);
      mouseIDs = mouseInputValues; // I know this is dirty. Too lazy to fix right now
    }

    if (csvFile) {
      setCsvFileExists(true);
      setCsvFileData(csvFile);
    }
  };

  const continueHandler = async () => {
    const mouseInputValuesRaw = [
      props.input1.current.value,
      props.input2.current.value,
      props.input3.current.value,
      props.input4.current.value,
    ];
    const mouseInputValues = mouseInputValuesRaw.filter(Boolean); // put this outside function

    if (!metadataFileExists) {
      console.log("METADATA FILE DOES NOT EXIST");

      console.log(mouseInputValues);
      dispatch(
        setMetadataValue({
          category: "mice",
          value: mouseInputValues,
        })
      );
      dispatch(setupCategories(mouseInputValues));
    }

    // Parse CSV file and re-construct redux state
    // if (csvFile) {
    if (csvFileExists) {
      const parseCsv = (file) => {
        return new Promise((resolve) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              console.log("parsed csv:", results.data);
              resolve(results.data);
            },
          });
        });
      };

      // const csvData = await parseCsv(csvFile);
      const csvData = await parseCsv(csvFileData);

      const initialReduxData = [
        {
          categoryName: "stats",
          events: [],
        },
      ];

      // console.log(csvData, mouseIDs);

      // mouseIDs.forEach((mouse) => {
      mouseInputValues.forEach((mouse) => {
        initialReduxData.push({
          categoryName: mouse,
          events: [],
        });
      });

      csvData.forEach((event) => {
        const eventCategory = event.Mouse;
        const reduxDataIndex = initialReduxData.findIndex(
          (cat) => cat.categoryName === eventCategory
        );

        const formattedEventData = {
          eventType: event["Type"],
          eventTimeSec: +event["Video Event Time (s)"],
          measureAtTimeSec: +event["Video Measure Time (s)"],
          eventID: uuidv4(),
          location: event["Location"],
          note: event["Note"],
          pixelArea: event["Pixel Area"],
          calculations: event["Calculations"],
        };

        initialReduxData[reduxDataIndex].events.push(formattedEventData);
      });

      console.log(initialReduxData, "🎡");
      dispatch(loadCategories({ data: initialReduxData }));
    }

    props.setIsAtStart(false);
    // dispatch(loadMetadata({ metadata: props.loadedMetadata }));
  };

  return (
    <div>
      <div className="flex gap-2">
        {/* <p className="w-24">Select Folder:</p> */}
        <div className="flex gap-2">
          <label
            htmlFor="folderInput"
            className="border-[1px] h-8 w-28 flex justify-center items-center"
          >
            <p>Select Folder</p>
          </label>
          <div className="flex flex-col gap-1">
            {folderName && <p>📁 {folderName}</p>}
            {mp4FileName && <p>🎥 {mp4FileName}</p>}
          </div>
        </div>
        <input
          id="folderInput"
          type="file"
          webkitdirectory="true"
          onChange={handleFolderUpload}
          //   onChange={props.handleFileUpload}
          className="hidden"
          // className="border-[1px] block w-164"
        />
        {/* {props.videoIsLoaded && <div>✔</div>} */}
      </div>

      <div className="flex gap-2 mt-2">
        <h3 className="w-28">Mouse ID's:</h3>
        <div className="flex gap-2 flex-grow">
          <div className="w-1/2">
            <div className="flex flex-col">
              <label htmlFor="1" className="text-sm">
                Mouse 1
              </label>
              <input
                id="1"
                type="text"
                className="border-[1px]"
                ref={props.input1}
              />
            </div>
            <div className="mt-1 flex flex-col">
              <label htmlFor="2" className="text-sm">
                Mouse 2
              </label>
              <input
                id="2"
                type="text"
                className="border-[1px]"
                ref={props.input2}
              />
            </div>
          </div>
          <div className="w-1/2">
            <div className="flex flex-col">
              <label htmlFor="3" className="text-sm">
                Mouse 3
              </label>
              <input
                id="3"
                type="text"
                className="border-[1px]"
                ref={props.input3}
              />
            </div>
            <div className="mt-1 flex flex-col">
              <label htmlFor="4" className="text-sm">
                Mouse 4
              </label>
              <input
                id="4"
                type="text"
                className="border-[1px]"
                ref={props.input4}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          // onClick={() => props.continueHandler(false)}
          onClick={continueHandler}
          className="border-[1px] px-2 py-1 mt-1"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default SelectFolder;
