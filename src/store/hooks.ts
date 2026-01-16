import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// A hook to send actions like updating to Redux
export const useAppDispatch: () => AppDispatch = useDispatch;
// A hook to read data from Redux like if a user is logged in
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;