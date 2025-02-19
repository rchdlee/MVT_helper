import { CSVLink } from "react-csv";
import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";
import EventSummary from "./EventSummary";

const End = (props) => {
  //   const fileName = props.videoName.split(".")[0] + "_eventdata";

  const backButtonHandler = () => {
    props.setIsAtEnd(false);
  };

  const addSecondsToActualStartTime = (timeSec) => {
    const startTime = props.data.startTimeIRL;
    const startTimeArray = startTime.split(":");

    const startTimeInSec =
      +startTimeArray[0] * 3600 +
      +startTimeArray[1] * 60 +
      +startTimeArray[2] +
      +startTimeArray[3] * 0.001;

    const newTimeInSec = +startTimeInSec + +timeSec;

    const totalTimeSec = +newTimeInSec;
    let newHr = Math.trunc(totalTimeSec / 3600);
    let newMin = Math.trunc((totalTimeSec - newHr * 3600) / 60);
    let newSec = Math.trunc(totalTimeSec - newHr * 3600 - newMin * 60);
    let newMsec = Math.trunc(
      (totalTimeSec - newHr * 3600 - newMin * 60 - newSec) * 1000
    );

    if (newMsec.toString().length === 1) {
      newMsec = "00" + newMsec;
    }
    if (newMsec.toString().length === 2) {
      newMsec = "0" + newMsec;
    }
    if (newSec.toString().length === 1) {
      newSec = "0" + newSec;
    }
    if (newMin.toString().length === 1) {
      newMin = "0" + newMin;
    }
    if (newHr.toString().length === 1) {
      newHr = "0" + newHr;
    }

    // const newTimeFormatted = `${newHr}:${newMin}:${newSec}:${newMsec}`;
    const newTimeFormatted = `${newHr}:${newMin}:${newSec}`;
    return newTimeFormatted;
  };

  const calculateFrameNumber = (start_time, end_time) => {
    const startArr = start_time.split(":");
    const endArr = end_time.split(":");

    const startTime = new Date(
      `2025-01-01T${startArr[0]}:${startArr[1]}:${startArr[2]}.${startArr[3]}`
    );

    const endTime = new Date(
      `2025-01-01T${endArr[0]}:${endArr[1]}:${endArr[2]}.${endArr[3]}`
    );

    const secDif = (endTime - startTime) / 1000;
    const numberFrames = secDif / (2 / 3);
    return numberFrames;
  };
  const numberFrames = calculateFrameNumber(
    props.data.startTimeIRL,
    props.data.endTimeIRL
  );

  const calculateVideoClockTime = (timeSec) => {
    const recordingDuration = props.videoState.duration;
    const timeFrac = +timeSec / +recordingDuration;

    const frameNumber = Math.round(timeFrac * numberFrames);
    const timeToAddSec = frameNumber * (2 / 3);

    // console.log(
    //   "adding",
    //   timeToAddSec,
    //   "seconds to the start time of:",
    //   props.data.startTimeIRL,
    //   "end time is:",
    //   props.data.endTimeIRL,
    //   "duration is",
    //   recordingDuration,
    //   "timesec is",
    //   timeSec,
    //   "timefrac is",
    //   timeFrac,
    //   "number of frames in the acutal video:",
    //   numberFrames,
    //   "frameNumber:",
    //   frameNumber
    // );

    const newTimeFormatted = addSecondsToActualStartTime(timeToAddSec);
    return newTimeFormatted;
  };

  const headers = [
    { label: "Mouse", key: "mouse" },
    { label: "Type", key: "type" },
    { label: "Location", key: "location" },
    { label: "Note", key: "note" },
    { label: "Actual Event Time (s)", key: "actual_event_time" },
    { label: "Actual Measure Time (s)", key: "actual_measure_time" },
    { label: "Video Event Time (s)", key: "video_event_time" },
    { label: "Video Measure Time (s)", key: "video_measure_time" },
  ];

  const csvData = [];

  props.data.data.forEach((cat) => {
    const mouseName = cat.categoryName;
    cat.events.forEach((event) => {
      csvData.push({
        mouse: mouseName,
        type: event.eventType,
        location: event.location,
        note: event.note,
        actual_event_time: calculateVideoClockTime(event.eventTimeSec),
        actual_measure_time:
          event.eventType === "void"
            ? calculateVideoClockTime(event.measureAtTimeSec)
            : "",
        video_event_time: event.eventTimeSec,
        video_measure_time: event.measureAtTimeSec,
      });
    });
  });

  console.log(props.data.data, csvData, "👏");

  return (
    <div className="flex flex-col justify-between">
      <div>
        <button
          onClick={backButtonHandler}
          className="flex gap-1 items-end group"
        >
          <p>👈</p>
          <p className="group-hover:underline">Back to Timeline</p>
        </button>
        <EventSummary
          eventData={props.data.data}
          calculateVideoClockTime={calculateVideoClockTime}
          seekTo={props.seekTo}
        />
      </div>
      <div className="group">
        <CSVLink
          data={csvData}
          headers={headers}
          //   filename={fileName}
          className="flex gap-1"
        >
          <p className="group-hover:underline">Download CSV</p>
          <p>⬇</p>
        </CSVLink>
      </div>
    </div>
  );
};

export default End;
