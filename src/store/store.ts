import { configureStore } from '@reduxjs/toolkit'; // Import the function to create the Redux store
import authReducer from './authSlice'; // Connect authSlice to the store

// Creates the Redux store and connects the auth reducer
export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for non-serializable data
    }),
});

// RootState and AppDispatch - TypeScript types for Redux
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;