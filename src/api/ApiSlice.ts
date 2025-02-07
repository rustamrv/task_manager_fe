import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TAGS } from './constants/Tags';
import { clearToken } from './AuthSlice';
import { RootState } from './Store';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(clearToken());
    window.location.href = '/';
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [TAGS.PROFILE, TAGS.TASKS],
  endpoints: () => ({}),
});
