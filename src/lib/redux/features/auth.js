import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  uid: "",
  user: {},
};

export const authSlice = createSlice({
  name: "authState",
  initialState,
  reducers: {
    setUID: (state, action) => {
      state.uid = action.payload;
    },
    setUserRedux: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {setUID, setUserRedux} = authSlice.actions;
export default authSlice.reducer;
