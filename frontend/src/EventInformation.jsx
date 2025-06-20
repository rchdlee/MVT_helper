import { useSelector, useDispatch } from "react-redux";
import {
  setMeasureAtTime,
  setLocationString,
  setNoteString,
  deleteEvent,
  editEventTime,
  switchEventType,
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
  // console.log(
  //   reduxState,
  //   eventInformation,
  //   props.selectedAnnotationIdentifiers,
  //   "😜"
  // );

  const switchEventTypeHandler = () => {
    console.log("switching event");
    dispatch(
      switchEventType({
        category: props.selectedAnnotationIdentifiers.categoryName,
        eventID: props.selectedAnnotationIdentifiers.eventID,
      })
    );
  };

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
  const seekToEventTimeHandler = () => {
    props.seekTo(eventInformation?.eventTimeSec);
  };
  const seekToMeasureAtTimeHandler = () => {
    props.seekTo(eventInformation?.measureAtTimeSec);
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
    <div className="bg-green-100 p-2 text-sm flex gap-2 justify-between items-start">
      <div className="">
        {/* MOUSE ID */}
        <div className="mb-1">
          <p>Mouse ID: {props.selectedAnnotationIdentifiers.categoryName}</p>
        </div>
        {/* EVENT TYPE */}
        <div className="flex gap-2 mb-1">
          <p>Event Type: {eventInformation?.eventType.toUpperCase()}</p>
          <button
            className="group flex items-center gap-1"
            onClick={switchEventTypeHandler}
          >
            <p>🔄</p>
            <p className="opacity-0 group-hover:opacity-100 text-[10px]">
              SWITCH EVENT TYPE
            </p>
          </button>
        </div>
        {/* EVENT TIME */}
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex gap-2 cursor-pointer group"
            onClick={seekToEventTimeHandler}
          >
            <p className="">Event Time ⏱ :</p>
            <p
              className="cursor-pointer group-hover:underline"
              // onClick={seekToTimeHandler}
            >
              {secondsToMinAndSecDecimal(eventInformation?.eventTimeSec)}
            </p>
          </div>
          <div>|</div>

          <button
            className="flex gap-1 items-start group"
            onClick={editEventTimeHandler}
          >
            <p>🖋</p>
            <p className="opacity-0 group-hover:opacity-100 text-[10px]">
              Set New Event Time
            </p>
          </button>
        </div>
        {/* MEASURE AT TIME */}
        {eventInformation?.eventType === "void" && (
          <div>
            {eventInformation?.measureAtTimeSec ? (
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="flex gap-2 cursor-pointer group"
                  onClick={seekToMeasureAtTimeHandler}
                >
                  <p>Measure Time 📏 : </p>
                  <p
                    className="group-hover:underline cursor-pointer"
                    // onClick={seekToTimeHandler}
                  >
                    {secondsToMinAndSecDecimal(
                      eventInformation?.measureAtTimeSec
                    )}
                  </p>
                </div>
                <div>|</div>

                <button
                  className="flex gap-1 items-start group"
                  onClick={setMeasureAtTimeHandler}
                >
                  <p>🖋</p>
                  <p className="opacity-0 group-hover:opacity-100 text-[10px]">
                    Set New Measure Time
                  </p>
                </button>
              </div>
            ) : (
              <div
                className="flex gap-2 cursor-pointer group"
                onClick={setMeasureAtTimeHandler}
              >
                <p>Measure Time 📏 : </p>
                <button className="flex group gap-1">
                  <p className="group-hover:underline">SET MEASURE TIME</p>
                  <p>📍</p>
                </button>
              </div>
            )}
          </div>
        )}
        <button
          className="group flex items-center gap-1 mt-4"
          onClick={deleteEventHandler}
        >
          <p className="text-red-500 group-hover:underline font-semibold text-sm">
            DELETE EVENT
          </p>
          <p>❌</p>
        </button>
      </div>
      <div className="grow">
        <div className="flex flex-col">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={eventInformation.location}
            // defaultValue={eventInformation.location}
            onChange={setLocationHandler}
            // onBlur={setLocationHandler}
            className="border-[1px]"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location">Notes</label>
          <textarea
            // type="text"
            id="notes"
            value={eventInformation.note}
            // defaultValue={eventInformation.note}
            onChange={setNoteHandler}
            // onBlur={setNoteHandler}
            className="border-[1px]"
          />
        </div>
      </div>
      {/* <div className="flex flex-col items-end">
        <button
          className="group flex items-center gap-1"
          onClick={deleteEventHandler}
        >
          <p className="text-red-500 group-hover:underline font-semibold text-sm">
            DELETE EVENT
          </p>
          <p>❌</p>
        </button>
        <button
          className="group flex items-center gap-1"
          onClick={deleteEventHandler}
        >
          <p className="group-hover:underline text-sm">SWITCH EVENT TYPE</p>
          <p>🔄</p>
        </button>
        <button
          className="group flex gap-1"
          onClick={editEventTimeHandler}
          // id={`${props.selectedAnnotationIdentifiers.categoryName}_${props.selectedAnnotationIdentifiers.eventID}`}
        >
          <p className="group-hover:underline">SET EVENT TIME</p>
          <p>🖋</p>
        </button>
        <button
          className="flex group gap-1"
          onClick={setMeasureAtTimeHandler}
          // id={`${props.selectedAnnotationIdentifiers.categoryName}_${props.selectedAnnotationIdentifiers.eventID}`}
        >
          <p className="group-hover:underline">SET MEASURE TIME</p>
          <p>🖋</p>
        </button>
      </div> */}
    </div>
  );
};

export default EventInformation;
