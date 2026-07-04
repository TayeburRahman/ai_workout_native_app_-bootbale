import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as SecureStore from "expo-secure-store";

// USER TYPE (customize based on your API)
export interface User {
  id: string;
  fullName: string;
  email: string;
}

// AUTH STATE TYPE
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // SET USER & TOKEN
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // ALWAYS stringify
      SecureStore.setItemAsync("user", JSON.stringify(action.payload.user));
      SecureStore.setItemAsync("token", String(action.payload.token));
    },

    // LOGOUT
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
