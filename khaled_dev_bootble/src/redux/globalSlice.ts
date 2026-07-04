import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GlobalData {
  datefilter: string;
  name: string;
  value: number;
  imageurl: string;
}

interface GlobalState {
  global: GlobalData;
}

const today = new Date();
const formattedToday = `${today.getFullYear()}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

const initialState: GlobalState = {
  global: {
    datefilter: formattedToday,
    name: "",
    value: 0,
    imageurl: "",
  },
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setGlobalData: (state, action: PayloadAction<Partial<GlobalData>>) => {
      state.global = { ...state.global, ...action.payload };
    },
    resetGlobalData: (state) => {
      state.global = {
        ...initialState.global,
        datefilter: formattedToday,
      };
    },
  },
});

export const { setGlobalData, resetGlobalData } = globalSlice.actions;
export default globalSlice.reducer;
