import { apiSlice } from '../ApiSlice';
import { CreateTask, GetTask, Task, UpdateTask } from '../types/TaskTypes';

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<GetTask[], void>({
      query: () => '/tasks',
    }),
    addTask: builder.mutation<Task, CreateTask>({
      query: (task: CreateTask) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
    }),
    updateTask: builder.mutation<Task, { id: string; task: UpdateTask }>({
      query: ({ id, task }: { id: string; task: UpdateTask }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
    }),
    deleteTask: builder.mutation({
      query: (id: string) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
    }),
    getTaskStats: builder.query({
      query: () => '/tasks/stats',
    }),
    getTaskCompletionStats: builder.query({
      query: () => '/tasks/completion-stats',
    }),
    getTasksByStatus: builder.query({
      query: (status: string) => `/tasks/status/${status}`,
    }),
  }),
});

export const {
  useGetAllTasksQuery, 
  useAddTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskStatsQuery,
  useGetTaskCompletionStatsQuery,
  useGetTasksByStatusQuery,
} = tasksApi;
