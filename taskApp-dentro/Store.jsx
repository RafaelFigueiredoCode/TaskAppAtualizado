import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice'
import tasksReducer from './features/tasksSlice'

export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
});

