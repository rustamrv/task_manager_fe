import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAGS } from './constants/Tags';

// Base API configuration
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string } }).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [TAGS.PROFILE, TAGS.TASKS],
  endpoints: () => ({}),
});
