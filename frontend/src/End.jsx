import { CSVLink } from "react-csv";
import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";

const End = (props) => {
  const backButtonHandler = () => {
    props.setIsAtEnd(false);
  };

  console.log(props.data, "🐱‍🚀");

  const calculateTimeDifferentialMsec2Decimal = (start_time, end_time) => {
    const startTimeArray = start_time.split(":");
    const endTimeArray = end_time.split(":");

    let msec;
    let sec;
    let min;
    let hr;

    // calculate msec
    if (startTimeArray[3] > endTimeArray[3]) {
      endTimeArray[2] - 1;
      msec = endTimeArray[3] + 100 - startTimeArray[3];
    }
    if (startTimeArray[3] < endTimeArray[3]) {
      msec = endTimeArray[3] - startTimeArray[3];
    }
    console.log(msec, "🐱‍🚀");

    // calculate sec
    if (startTimeArray[2] > endTimeArray[2]) {
      endTimeArray[1] - 1;
      sec = endTimeArray[2] + 60 - startTimeArray[2];
    }
    if (startTimeArray[2] < endTimeArray[2]) {
      sec = endTimeArray[2] - startTimeArray[2];
    }
    console.log(sec, sec.toString().length, "🐱‍🐉");

    // calculate min
    if (startTimeArray[1] > endTimeArray[1]) {
      endTimeArray[0] - 1;
      min = endTimeArray[1] + 60 - startTimeArray[1];
    }
    if (startTimeArray[1] < endTimeArray[1]) {
      min = endTimeArray[1] - startTimeArray[1];
    }
    console.log(min, "😜");

    // calculate hr
    hr = endTimeArray[0] - startTimeArray[0];
    console.log(hr, "🙌");

    // if only 1 digit, add 0 in front
    // function^
    if (msec.toString().length === 1) {
      msec = "0" + msec;
    }
    if (sec.toString().length === 1) {
      sec = "0" + sec;
    }
    if (min.toString().length === 1) {
      min = "0" + min;
    }
    if (hr.toString().length === 1) {
      hr = "0" + hr;
    }
    const actualVideoLengthFormatted = `${hr}:${min}:${sec}:${msec}`;
    const actualVideoLengthSeconds =
      +hr * 3600 + +min * 60 + +sec + 0.01 * +msec;

    const timeRatio = actualVideoLengthSeconds / props.videoState.duration;
    console.log(timeRatio);
    return timeRatio;
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

    const newTimeFormatted = `${newHr}:${newMin}:${newSec}:${newMsec}`;
    // console.log(startTime, startTimeInSec, timeSec, newTimeFormatted);
    return newTimeFormatted;
  };

  ///////////////////////////
  // frames approach
  const calculateFrames = (start_time, end_time) => {
    const startTimeArray = start_time.split(":");
    const endTimeArray = end_time.split(":");

    let msec;
    let sec;
    let min;
    let hr;

    // calculate msec
    if (startTimeArray[3] > endTimeArray[3]) {
      endTimeArray[2] - 1;
      msec = endTimeArray[3] + 100 - startTimeArray[3];
    }
    if (startTimeArray[3] < endTimeArray[3]) {
      msec = endTimeArray[3] - startTimeArray[3];
    }
    console.log(msec, "🐱‍🚀");

    // calculate sec
    if (startTimeArray[2] > endTimeArray[2]) {
      endTimeArray[1] - 1;
      sec = endTimeArray[2] + 60 - startTimeArray[2];
    }
    if (startTimeArray[2] < endTimeArray[2]) {
      sec = endTimeArray[2] - startTimeArray[2];
    }
    console.log(sec, sec.toString().length, "🐱‍🐉");

    // calculate min
    if (startTimeArray[1] > endTimeArray[1]) {
      endTimeArray[0] - 1;
      min = endTimeArray[1] + 60 - startTimeArray[1];
    }
    if (startTimeArray[1] < endTimeArray[1]) {
      min = endTimeArray[1] - startTimeArray[1];
    }
    console.log(min, "😜");

    // calculate hr
    hr = endTimeArray[0] - startTimeArray[0];
    console.log(hr, "🙌");

    // if only 1 digit, add 0 in front
    // function^
    if (msec.toString().length === 1) {
      msec = "0" + msec;
    }
    if (sec.toString().length === 1) {
      sec = "0" + sec;
    }
    if (min.toString().length === 1) {
      min = "0" + min;
    }
    if (hr.toString().length === 1) {
      hr = "0" + hr;
    }
    const actualVideoLengthFormatted = `${hr}:${min}:${sec}:${msec}`;
    const actualVideoLengthSeconds =
      +hr * 3600 + +min * 60 + +sec + 0.01 * +msec;

    const numberFrames = actualVideoLengthSeconds / (2 / 3);
    // const numberFrames = actualVideoLengthSeconds * (3 / 2);
    console.log(
      "start",
      props.data.startTimeIRL,
      "end",
      props.data.endTimeIRL,
      actualVideoLengthFormatted,
      actualVideoLengthSeconds,
      numberFrames,
      "🦥"
    );
    return numberFrames;
  };

  const numberFrames = calculateFrames(
    props.data.startTimeIRL,
    props.data.endTimeIRL
  );
  const calculateVideoClockTime = (timeSec) => {
    const recordingDuration = props.videoState.duration;
    const timeFrac = +timeSec / +recordingDuration;

    const frameNumber = Math.round(timeFrac * numberFrames);
    const timeToAddSec = frameNumber * (2 / 3);

    const newTimeFormatted = addSecondsToActualStartTime(timeToAddSec);
    return newTimeFormatted;
  };

  const timeRatio = calculateTimeDifferentialMsec2Decimal(
    props.data.startTimeIRL,
    props.data.endTimeIRL
  );

  const headers = [
    { label: "Mouse", key: "mouse" },
    { label: "Type", key: "type" },
    { label: "Location", key: "location" },
    { label: "Note", key: "note" },
    { label: "Video Event Time (s)", key: "video_event_time" },
    { label: "Video Measure Time (s)", key: "video_measure_time" },
    { label: "Actual Event Time (s)", key: "actual_event_time" },
    { label: "Actual Measure Time (s)", key: "actual_measure_time" },
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
        video_event_time: event.eventTimeSec,
        // video_event_time: secondsToMinAndSecDecimal(event.eventTimeSec),
        video_measure_time: event.measureAtTimeSec,
        // video_measure_time: secondsToMinAndSecDecimal(event.measureAtTimeSec),
        // actual_event_time: addSecondsToActualStartTime(
        //   (event.eventTimeSec * timeRatio).toFixed(2)
        // ),
        actual_event_time: calculateVideoClockTime(event.eventTimeSec),
        // actual_measure_time:
        //   event.eventType === "void"
        //     ? addSecondsToActualStartTime(
        //         (event.measureAtTimeSec * timeRatio).toFixed(2)
        //       )
        //     : "",
        actual_measure_time:
          event.eventType === "void"
            ? calculateVideoClockTime(event.measureAtTimeSec)
            : "",
      });
    });
  });

  console.log(csvData, "👏");

  return (
    <div>
      <p>end screen</p>
      <button onClick={backButtonHandler}>back</button>
      <div>
        <CSVLink data={csvData} headers={headers}>
          Download me
        </CSVLink>
      </div>
    </div>
  );
};

export default End;
