import { createSlice , PayloadAction} from "@reduxjs/toolkit";

interface PlayerState {
  value: string;
}
const initialState: PlayerState = {
    value: '',
    };

const playerSlice = createSlice({name: "player", initialState, reducers: {
    login: (state, action: PayloadAction<string>) => {
        state.value = action.payload;
    },
    logout:(state) => {
        state.value = "";
    }
}});

export const { login, logout} = playerSlice.actions;

export default playerSlice.reducer;
