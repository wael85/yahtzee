// this automatically imports the configureStore function from the @reduxjs/toolkit package
// and the ConfigureStore type from the same package.
// The ConfigureStore type is a generic type that takes two type arguments: the type of the root state and the type of the root reducer.
// The configureStore function takes an options object as an argument and returns a Redux store.
// The options object can have the following properties:
// reducer: A function that takes the current state and an action and returns the new state. This is the root reducer that combines all the other reducers in the application.
// middleware: An array of middleware functions that can intercept and process actions before they reach the reducers.
// devTools: A boolean flag that enables or disables the Redux DevTools extension.
// preloadedState: The initial state of the store.
// it also use the thunk middleware to enable asynchronous actions in the application.
import { configureStore } from "@reduxjs/toolkit";
import { yahtzeeApiSlice } from "../features/yahtzee-game/game-api.slice";
import playerReducer from "../features/player/player-slice";

export const store = configureStore({
    // this will creat a store with a counter slice reducer. can be accessed by store.getState().counter.value
    reducer: {
        player: playerReducer,
        [yahtzeeApiSlice.reducerPath]: yahtzeeApiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(yahtzeeApiSlice.middleware);
    }

});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
