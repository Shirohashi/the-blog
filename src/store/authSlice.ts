import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@supabase/supabase-js';

//Defines what we are storing (user object and loading state)
interface AuthState {
    user: User | null;
    loading: boolean
}

// Starting values - when no user is logged in then loading is true
const initialState: AuthState = {
    user: null,
    loading: true
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Function to save or update the logged in user
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
            state.loading = false;
        },
        // Function to update loading state
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    }
});

// Exports the functions to be used in the app
export const { setUser, setLoading } = authSlice.actions;
// Exports the reducer to be used in the store
export default authSlice.reducer;