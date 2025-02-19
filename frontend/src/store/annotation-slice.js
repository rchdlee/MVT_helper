import { createSlice, current } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

const initialState = {
  // startTimeIRL: null,
  // endTimeIRL: null,
  // data: [],
  startTimeIRL: "19:14:18:403",
  endTimeIRL: "21:30:29:788",
  data: [
    {
      categoryName: "mouse1",
      events: [
        {
          eventType: "void",
          eventTimeSec: 25,
          measureAtTimeSec: 200,
          eventID: "testid1a",
          location: "RBC",
          note: "my note",
        },
        {
          eventType: "void",
          eventTimeSec: 425,
          measureAtTimeSec: 525,
          eventID: "testid1b",
          location: "",
          note: "",
        },
      ],
    },
    {
      categoryName: "mouse2",
      events: [
        {
          eventType: "void",
          eventTimeSec: 200,
          measureAtTimeSec: 425,
          eventID: "testid2",
          location: "",
          note: "my note 2",
        },
      ],
    },
    {
      categoryName: "mouse3",
      events: [
        {
          eventType: "leak",
          eventTimeSec: 35,
          measureAtTimeSec: null,
          eventID: "testid3",
          location: "",
          note: "",
        },
      ],
    },
    {
      categoryName: "mouse4",
      events: [
        {
          eventType: "void",
          eventTimeSec: 75,
          measureAtTimeSec: 220,
          eventID: "testid4",
          location: "",
          note: "",
        },
      ],
    },
  ],
};

const annotationSlice = createSlice({
  name: "annotation",
  initialState,
  reducers: {
    setupCategories: (state, action) => {
      //   const data = action.payload;
      const inputValues = action.payload;

      for (let i = 0; i < inputValues.length; i++) {
        const category = {
          categoryName: inputValues[i],
          events: [],
        };
        state.data.push(category);
      }
    },
    addNewEvent: (state, action) => {
      const data = action.payload;
      const categoryName = data.category;
      const eventType = data.eventType;
      const eventTime = data.eventTime;
      const eventID = data.eventID;
      // const eventID = uuidv4();

      console.log(data);

      state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.push({
          eventID: eventID,
          eventType: eventType,
          eventTimeSec: eventTime,
          measureAtTimeSec: null,
          location: "",
          note: "",
        });
    },
    setStartTimeIRL: (state, action) => {
      const startTime = action.payload;

      // needs a check so that the correct format is inputted
      state.startTimeIRL = startTime;
    },
    setEndTimeIRL: (state, action) => {
      const endTime = action.payload;

      // needs a check so that correct format is inputted
      state.endTimeIRL = endTime;
    },
    setMeasureAtTime: (state, action) => {
      const data = action.payload;
      const categoryName = data.category;
      const eventID = data.eventID;
      const measureAtTime = data.measureAtTime;

      state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.filter((event) => {
          return event.eventID === eventID;
        })[0].measureAtTimeSec = measureAtTime;
    },
    setLocationString: (state, action) => {
      const data = action.payload;
      const categoryName = data.category;
      const eventID = data.eventID;
      const location = data.location;

      state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.filter((event) => {
          return event.eventID === eventID;
        })[0].location = location;
    },
    setNoteString: (state, action) => {
      const data = action.payload;
      const categoryName = data.category;
      const eventID = data.eventID;
      const note = data.note;

      state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.filter((event) => {
          return event.eventID === eventID;
        })[0].note = note;
    },
    editEventTime: (state, action) => {
      const data = action.payload;
      const categoryName = data.category;
      const eventID = data.eventID;
      const newTime = data.newTime;

      state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.filter((event) => {
          return event.eventID === eventID;
        })[0].eventTimeSec = newTime;
    },
    deleteEvent: (state, action) => {
      const data = action.payload;
      const categoryName = data.category;
      const eventID = data.eventID;

      const event = state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.find((event) => event.eventID === eventID);

      const eventIndex = state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.indexOf(event);

      state.data
        .filter((cat) => {
          return cat.categoryName === categoryName;
        })[0]
        .events.splice(eventIndex, 1);
      console.log(eventIndex, "🦥");
    },
  },
});

export const {
  setupCategories,
  addNewEvent,
  setStartTimeIRL,
  setEndTimeIRL,
  setMeasureAtTime,
  setLocationString,
  setNoteString,
  editEventTime,
  deleteEvent,
} = annotationSlice.actions;

export default annotationSlice.reducer;

// const annotationSlice = createSlice({
//   name: "annotations",
//   initialState: {
//     inputData: null,
//     annotations: [
//       // {
//       //   segmentID: "1249-yu23",
//       //   timeStartSec: 14,
//       //   timeEndSec: 27.9,
//       //   categoryName: "Head movements",
//       //   radio: null,
//       //   comments: "test comment",
//       //   channelHasRadio: true,
//       // },
//       // {
//       //   segmentID: "2f2t-3tku",
//       //   timeStartSec: 125,
//       //   timeEndSec: 142,
//       //   categoryName: "Head movements",
//       //   radio: "Shake",
//       //   comments: "",
//       //   channelHasRadio: true,
//       // },
//       // {
//       //   segmentID: "2pvf-tvh2",
//       //   timeStartSec: 218,
//       //   timeEndSec: 224,
//       //   categoryName: "Expressions",
//       //   radio: null,
//       //   comments: "",
//       //   channelHasRadio: true,
//       // },
//       // {
//       //   segmentID: "9849-th38",
//       //   timeStartSec: 232,
//       //   timeEndSec: 265,
//       //   categoryName: "QC Problems",
//       //   radio: null,
//       //   comments: "",
//       //   channelHasRadio: false,
//       // },
//       // {
//       //   segmentID: "t33t-38fb",
//       //   timeStartSec: 278,
//       //   timeEndSec: 283,
//       //   categoryName: "Speech",
//       //   radio: null,
//       //   comments: "",
//       //   channelHasRadio: false,
//       // },
//     ],
//     currentlySelectedSegmentID: null,
//     currentlySelectedSegmentArrayIndex: null,
//     timelineValueRange: null,
//     // zoom: 1,
//   },
//   reducers: {
//     setVideoInputData(state, action) {
//       const input = action.payload;
//       state.inputData = input;
//     },
//     setTimelineValueRange(state, action) {
//       const rangeArray = action.payload;
//       state.timelineValueRange = rangeArray;
//       console.log("set new value range! 😎");
//     },
//     setCurrentlySelectedSegment(state, action) {
//       const id = action.payload;
//       const index = state.annotations.findIndex(
//         (anno) => anno.segmentID === id
//       );
//       state.currentlySelectedSegment = id;
//       state.currentlySelectedSegmentArrayIndex = index;
//     },
//     setRadioValue(state, action) {
//       const option = action.payload;
//       state.annotations[state.currentlySelectedSegmentArrayIndex].radio =
//         option;
//       console.log("updated radio 🔥");
//     },
//     setComment(state, action) {
//       const comment = action.payload;
//       state.annotations[state.currentlySelectedSegmentArrayIndex].comments =
//         comment;
//     },
//     addAnnotation(state, action) {
//       const data = action.payload;

//       const annotation = {
//         segmentID: data.segmentID,
//         timeStartSec: data.timeStartSec,
//         timeEndSec: data.timeEndSec,
//         categoryName: data.categoryName,
//         radio: null,
//         comments: null,
//         channelHasRadio: data.channelHasRadio,
//       };
//       state.annotations.push(annotation);
//     },
//     deleteSelectedAnnotation(state) {
//       const index = state.currentlySelectedSegmentArrayIndex;
//       state.annotations.splice(index, 1);
//     },
//     editSelectedAnnotationStartTime(state, action) {
//       const newStartTimeSec = action.payload;
//       const index = state.currentlySelectedSegmentArrayIndex;
//       state.annotations[index].timeStartSec = newStartTimeSec;
//     },
//     editSelectedAnnotationEndTime(state, action) {
//       const newEndTimeSec = action.payload;
//       const index = state.currentlySelectedSegmentArrayIndex;
//       state.annotations[index].timeEndSec = newEndTimeSec;
//     },
//   },
// });

// export const annotationActions = annotationSlice.actions;

// export default annotationSlice;
