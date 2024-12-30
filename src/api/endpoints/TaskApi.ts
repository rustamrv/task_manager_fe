import { apiSlice } from '../ApiSlice';
import { CreateTask, GetTask, Task, TaskCompletionStatsResponse, TaskStatsResponse, UpdateTask } from '../types/TaskTypes';

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
    deleteTask: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
    }),
    getTaskStats: builder.query<TaskStatsResponse, void>({
      query: () => '/tasks/stats',
    }),
    getTaskCompletionStats: builder.query<TaskCompletionStatsResponse[], void>({
      query: () => '/tasks/completion-stats',
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
} = tasksApi;
