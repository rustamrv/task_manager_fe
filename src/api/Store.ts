import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './ApiSlice';
import authReducer from './AuthSlice';
import { usersApi } from './endpoints/UserApi';
import { tasksApi } from './endpoints/TaskApi';
import { authApi } from './endpoints/AuthApi';

// Store configuration
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    users: usersApi.reducer,
    tasks: tasksApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authApi.middleware,
      usersApi.middleware,
      tasksApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
