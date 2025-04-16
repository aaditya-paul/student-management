import {combineReducers} from "@reduxjs/toolkit";
import authReducer from "./features/auth";

const rootReducer = combineReducers({
  authState: authReducer,
  // other reducers can be added here
});

export default rootReducer;
