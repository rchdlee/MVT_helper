import { useState } from "react";
import { secondsToMinAndSecDecimal } from "./helpers/SecondsTimeFormat";

const EventSummary = (props) => {
  const [selectedTab, setSelectedTab] = useState(
    props.eventData[0].categoryName
  );

  const setMouseTabHandler = (e) => {
    const mouseID = e.target.closest("div").id;
    setSelectedTab(mouseID);
  };

  const seekToTimeHandler = (e) => {
    console.log("seeking to");
    props.seekTo(+e.target.closest("button").id);
  };

  const mouseTabsJSX = props.eventData.map((mouse) => {
    return (
      <div
        className={`border-2 px-2 py-1 cursor-pointer ${
          mouse.categoryName === selectedTab ? "bg-blue-200" : ""
        }`}
        key={mouse.categoryName}
        id={mouse.categoryName}
        onClick={setMouseTabHandler}
      >
        <h4>{mouse.categoryName}</h4>
      </div>
    );
  });

  const eventSummaryJSX = props.eventData.map((mouse) => {
    return (
      <div
        key={mouse.categoryName}
        className={`${mouse.categoryName === selectedTab ? "" : "hidden"}`}
      >
        {mouse.events.map((event, index) => {
          return (
            <div
              key={event.eventID}
              className={`${event.eventType === "void" && "bg-green-200"} ${
                event.eventType === "leak" && "bg-orange-200"
              }`}
            >
              <div className="flex gap-1">
                <p>{index + 1}.</p>
                <p>{event.eventType}</p>
              </div>
              <button
                className="flex gap-1 group cursor-pointer"
                onClick={seekToTimeHandler}
                id={event.eventTimeSec}
              >
                <p>Event Time:</p>
                <div className="group-hover:underline flex gap-1">
                  <p>{props.calculateVideoClockTime(event.eventTimeSec)}</p>
                  <p>({secondsToMinAndSecDecimal(event.eventTimeSec)})</p>
                </div>
              </button>
              {event.eventType === "void" && (
                <button
                  className="flex gap-1 group cursor-pointer"
                  onClick={seekToTimeHandler}
                  id={event.measureAtTimeSec}
                >
                  <p>Measuring Time:</p>
                  <div className="group-hover:underline flex gap-1">
                    <p>
                      {props.calculateVideoClockTime(event.measureAtTimeSec)}
                    </p>
                    <p>({secondsToMinAndSecDecimal(event.measureAtTimeSec)})</p>
                  </div>
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <div>
      {/* tabs */}
      <div className="flex">{mouseTabsJSX}</div>
      <div>{eventSummaryJSX}</div>
    </div>
  );
};

export default EventSummary;

// const eventSummaryJSX = props.data.data.map((mouse) => {
//     return (
//       <div key={mouse.categoryName}>
//         <h3>{mouse.categoryName}</h3>
//         {mouse.events.map((event, index) => {
//           return (
//             <div key={event.eventID}>
//               <p>{index}.</p>
//               <p>{event.eventType}</p>
//               <div className="flex gap-1">
//                 <p>Event Time:</p>
//                 <p>{event.eventTimeSec}</p>
//               </div>
//               <div className="flex gap-1">
//                 <p>Measure Time:</p>
//                 <p>{event.measureAtTimeSec}</p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     );
//   });
