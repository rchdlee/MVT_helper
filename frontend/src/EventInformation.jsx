import { useSelector, useDispatch } from "react-redux";
import {
  setMeasureAtTime,
  setLocationString,
  setNoteString,
  deleteEvent,
  editEventTime,
} from "./store/annotation-slice";
import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";

const EventInformation = (props) => {
  const dispatch = useDispatch();

  const reduxState = useSelector((state) => state.annotation.data);
  const eventInformation = reduxState
    .filter((cat) => {
      return (
        cat.categoryName === props.selectedAnnotationIdentifiers.categoryName
      );
    })[0]
    .events.filter((event) => {
      return event.eventID === props.selectedAnnotationIdentifiers.eventID;
    })[0];
  console.log(reduxState, eventInformation, "😜");

  const setMeasureAtTimeHandler = (e) => {
    // const eventInformationIdentifiers = e.target.id;
    // const categoryName = eventInformationIdentifiers.split("_")[0];
    // const eventID = eventInformationIdentifiers.split("_")[1];
    const currentTime = props.videoState.playedSec;
    // console.log(currentTime, categoryName, eventID);

    dispatch(
      setMeasureAtTime({
        category: props.selectedAnnotationIdentifiers.categoryName,
        eventID: props.selectedAnnotationIdentifiers.eventID,
        measureAtTime: currentTime,
      })
    );
    // dispatch(
    //   setMeasureAtTime({
    //     category: categoryName,
    //     eventID: eventID,
    //     measureAtTime: currentTime,
    //   })
    // );
  };

  const setLocationHandler = (e) => {
    const locationData = e.target.value;
    dispatch(
      setLocationString({
        category: props.selectedAnnotationIdentifiers.categoryName,
        eventID: props.selectedAnnotationIdentifiers.eventID,
        location: locationData,
      })
    );
  };

  const setNoteHandler = (e) => {
    const noteData = e.target.value;
    dispatch(
      setNoteString({
        category: props.selectedAnnotationIdentifiers.categoryName,
        eventID: props.selectedAnnotationIdentifiers.eventID,
        note: noteData,
      })
    );
  };

  const seekToTimeHandler = (e) => {
    const timeFormattedArray = e.target.innerHTML.split(":");
    const timeSec = +timeFormattedArray[0] * 60 + +timeFormattedArray[1];

    props.seekTo(timeSec);

    // console.log(timeFormattedArray, timeSec);
  };

  const editEventTimeHandler = () => {
    // console.log("editing event time to:", props.videoState.playedSec);
    dispatch(
      editEventTime({
        category: props.selectedAnnotationIdentifiers.categoryName,
        eventID: props.selectedAnnotationIdentifiers.eventID,
        newTime: props.videoState.playedSec,
      })
    );
  };

  const deleteEventHandler = () => {
    console.log("deleting event");
    props.setSelectedAnnotationIdentifiers(null);
    dispatch(
      deleteEvent({
        category: props.selectedAnnotationIdentifiers.categoryName,
        eventID: eventInformation?.eventID,
      })
    );
  };

  return (
    <div className="bg-blue-100">
      <button className="border-2" onClick={deleteEventHandler}>
        DEL
      </button>
      <p>event type: {eventInformation?.eventType}</p>
      <div className="flex">
        <p>time: {secondsToMinAndSecDecimal(eventInformation?.eventTimeSec)}</p>
        <button className="border-2" onClick={editEventTimeHandler}>
          SET TIME
        </button>
      </div>
      {eventInformation?.eventType === "void" && (
        <div className="flex">
          {eventInformation?.measureAtTimeSec ? (
            <div className="flex gap-2">
              <p>measure at: </p>
              <p
                className="underline cursor-pointer"
                onClick={seekToTimeHandler}
              >
                {secondsToMinAndSecDecimal(eventInformation?.measureAtTimeSec)}
              </p>
            </div>
          ) : (
            <div>
              <p>still needs measure at time</p>
            </div>
          )}
          <button
            className="border-2"
            onClick={setMeasureAtTimeHandler}
            // id={`${props.selectedAnnotationIdentifiers.categoryName}_${props.selectedAnnotationIdentifiers.eventID}`}
          >
            SET MEASURE TIME
          </button>
        </div>
      )}
      <div>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          defaultValue={eventInformation?.location}
          onBlur={setLocationHandler}
          className="border-[1px]"
        />
      </div>
      <div>
        <label htmlFor="location">Notes</label>
        <input
          type="text"
          id="notes"
          defaultValue={eventInformation?.notes}
          onBlur={setNoteHandler}
          className="border-[1px]"
        />
      </div>
    </div>
  );
};

export default EventInformation;
