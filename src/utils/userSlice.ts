import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type User = {
  firstName: string;
  lastName: string;
  photoUrl: string;
  age: string;
  gender: string;
  about: string;
  occupation: string;
  emailId: string;
};
type UserState = {
  user: User | null;
};
const initialState: UserState = {
  user: null,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    removeUser: state => {
      state.user = null;
    },
  },
});
export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
