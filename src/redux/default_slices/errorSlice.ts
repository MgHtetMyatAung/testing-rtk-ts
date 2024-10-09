import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the initial state
interface ErrorState {
  type: string | null;
  message: string | null;
  status: string | number | null;
}

const initialState: ErrorState = {
  type: null,
  message: null,
  status: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setErrorInfo: (
      state,
      action: PayloadAction<{
        type: string;
        message: string;
        status: string | number;
      }>
    ) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.status = action.payload.status;
    },
    removeErrorInfo: (state) => {
      state.type = null;
      state.message = null;
      state.status = null;
    },
  },
});

export const { setErrorInfo, removeErrorInfo } = errorSlice.actions;

export default errorSlice.reducer;
