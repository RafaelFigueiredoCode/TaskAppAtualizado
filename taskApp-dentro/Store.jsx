import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';
import tasksReducer from './features/taskSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    tasks: tasksReducer,
  },
});