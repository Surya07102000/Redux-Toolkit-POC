import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counterSlice';
import todoReducer from '../features/todoSlice';
import userReducer from '../features/userSlice';
import uiReducer from '../features/uiSlice';
import postsReducer from '../features/postsSlice';
import { apiSlice } from '../features/apiSlice';

// Custom middleware for logging
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Custom middleware for error handling
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    // You could dispatch an error action here
    return next(action);
  }
};

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
    user: userReducer,
    ui: uiReducer,
    posts: postsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [apiSlice.util.resetApiState.type],
      },
    })
      .concat(apiSlice.middleware)
      .concat(loggerMiddleware)
      .concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});
