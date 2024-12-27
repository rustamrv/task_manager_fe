import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Task } from '../interfaces';

interface User {
  _id: string;
  username: string;
  email: string;
}

interface Profile {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
}

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
  endpoints: (builder) => ({
    registerUser: builder.mutation<
      { token: string; message: string },
      { username: string; password: string; email: string }
    >({
      query: (newUser) => ({
        url: 'auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),

    loginUser: builder.mutation<
      { token: string },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getAllUsers: builder.query<User[], void>({
      query: () => 'profile/users',
    }),

    getAllTasks: builder.query<any[], void>({
      query: () => '/tasks',
    }),

    getTasksByStatus: builder.query<Task[], string>({
      query: (status) => `/api/tasks/status/${status}`,
    }),

    getTaskById: builder.query<Task, number>({
      query: (id) => `/api/tasks/${id}`,
    }),

    getProfile: builder.query<Profile, void>({
      query: () => 'profile',
    }),

    addTask: builder.mutation<Task, any>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
    }),
    updateTask: builder.mutation<Task, { id: string; task: Partial<Task> }>({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
    }),
    deleteTask: builder.mutation<{ id: string }, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
    }),
    getTaskStats: builder.query({ query: () => '/tasks/stats' }),
    getTaskCompletionStats: builder.query({
      query: () => '/tasks/completion-stats',
    }),
    updateProfile: builder.mutation<User, any>({
      query: (formData) => ({
        url: `/profile/upload`,
        method: 'PUT',
        body: formData,
      }),
    })
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskStatsQuery,
  useGetTaskCompletionStatsQuery,
  useGetAllUsersQuery,
  useGetAllTasksQuery,
  useGetTasksByStatusQuery,
  useGetTaskByIdQuery,
  useGetProfileQuery,
  useUpdateProfileMutation
} = apiSlice;
