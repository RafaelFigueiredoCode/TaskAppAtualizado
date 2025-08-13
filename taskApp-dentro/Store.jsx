import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../contexts/counterSlice'

const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
});

