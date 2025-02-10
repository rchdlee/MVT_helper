import { useSelector, useDispatch } from "react-redux";
import { setMeasureAtTime } from "./store/annotation-slice";
import {
  secondsToMinAndSec,
  secondsToMinAndSecDecimal,
} from "./helpers/SecondsTimeFormat";

const EventInformation = (props) => {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state.annotation.data);

  const setMeasureAtTimeHandler = (e) => {
    const eventInformationIdentifiers = e.target.id;
    const categoryName = eventInformationIdentifiers.split("_")[0];
    const eventID = eventInformationIdentifiers.split("_")[1];
    const currentTime = props.videoState.playedSec;
    console.log(currentTime, categoryName, eventID);

    dispatch(
      setMeasureAtTime({
        category: categoryName,
        eventID: eventID,
        measureAtTime: currentTime,
      })
    );
  };

  const eventInformation = reduxState
    .filter((cat) => {
      return (
        cat.categoryName === props.selectedAnnotationIdentifiers?.categoryName
      );
    })[0]
    .events.filter((event) => {
      return event.eventID === props.selectedAnnotationIdentifiers?.eventID;
    })[0];
  console.log(reduxState, eventInformation, "😜");

  return (
    <div>
      <p>event type: {eventInformation.eventType}</p>
      <p>time: {secondsToMinAndSecDecimal(eventInformation.eventTimeSec)}</p>
      {eventInformation.measureAtTimeSec ? (
        <p>
          measure at:{" "}
          {secondsToMinAndSecDecimal(eventInformation.measureAtTimeSec)}
        </p>
      ) : (
        <div>
          <p>still needs measure at time</p>
        </div>
      )}
      <button
        className="border-2"
        onClick={setMeasureAtTimeHandler}
        id={`${props.selectedAnnotationIdentifiers.categoryName}_${props.selectedAnnotationIdentifiers.eventID}`}
      >
        SET MEASURE TIME
      </button>
    </div>
  );
};

export default EventInformation;
