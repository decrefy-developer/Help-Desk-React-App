import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  _id: string;
  email: string;
  priviledge: string[];
  isActive: boolean;
  exp: number;
}

export const initialState: IUser = {
  _id: "",
  email: "",
  priviledge: [],
  isActive: false,
  exp: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<IUser>) {
      state._id = payload._id;
      state.email = payload.email;
      state.priviledge = payload.priviledge;
      state.isActive = payload.isActive;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
