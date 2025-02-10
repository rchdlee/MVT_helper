import { createSlice, current } from "@reduxjs/toolkit";
// import { v4 as uuidv4 } from "uuid";

const initialState = {
  data: [
    {
      categoryName: "mouse1",
      events: [
        {
          eventType: "void",
          eventTimeSec: 25,
          measureAtTimeSec: 200,
          eventID: "testid1a",
        },
        {
          eventType: "void",
          eventTimeSec: 425,
          measureAtTimeSec: 525,
          eventID: "testid1b",
        },
      ],
    },
    {
      categoryName: "mouse2",
      events: [
        {
          eventType: "void",
          eventTimeSec: 45,
          measureAtTimeSec: null,
          eventID: "testid2",
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
        },
      ],
    },
  ],
};

const annotationSlice = createSlice({
  name: "annotation",
  initialState,
  reducers: {
    testfunction: (state, action) => {
      console.log("hello from annotation slice redux");
    },
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
        });
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
  },
});

export const { testfunction, setupCategories, addNewEvent, setMeasureAtTime } =
  annotationSlice.actions;

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
