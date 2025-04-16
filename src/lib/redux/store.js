import {configureStore} from "@reduxjs/toolkit";
import rootReducer from "./storeCombiner";
export const store = configureStore({
  reducer: rootReducer,
});
