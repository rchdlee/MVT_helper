import { configureStore } from "@reduxjs/toolkit";

import annotationReducer from "./annotation-slice";

export const store = configureStore({
  reducer: { annotation: annotationReducer },
});

// import annotationSlice from "./annotation-slice";

// const store = configureStore({
//   reducer: { annotation: annotationSlice.reducer },
// });

// export default store;
