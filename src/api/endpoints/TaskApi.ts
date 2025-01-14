import { apiSlice } from '../ApiSlice';
import {
  CreateTask,
  GetTask,
  Task,
  TaskCompletionStatsResponse,
  TaskStatsResponse,
  UpdateTask,
} from '../types/TaskTypes';
import { TAGS } from '../constants/Tags';

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTasks: builder.query<GetTask, void>({
      query: () => '/tasks',
      providesTags: [TAGS.TASKS],
    }),
    addTask: builder.mutation<Task, CreateTask>({
      query: (task: CreateTask) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: [TAGS.TASKS],
      // Use optimistic update
      async onQueryStarted(task, { dispatch, queryFulfilled }) {
        const tempId = `temp-${Date.now()}`;
        const tempTask: Task = {
          id: tempId,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
          assignee: {
            _id: task.assignee,
            username: 'Temporary Username',
            email: 'temp@example.com',
          },
        };

        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            draft.tasks.push({ ...tempTask });
          })
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
              const index = draft.tasks.findIndex((t) => t.id === tempId);
              if (index !== -1) {
                draft.tasks[index] = data;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
    updateTask: builder.mutation<Task, { id: string; task: UpdateTask }>({
      query: ({ id, task }: { id: string; task: UpdateTask }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: [TAGS.TASKS],
      // Optimistic update
      async onQueryStarted({ id, task }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            const index = draft.tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
              draft.tasks[index] = {
                ...draft.tasks[index],
                ...task,
                assignee: task.assignee
                  ? typeof task.assignee === 'string'
                    ? {
                        _id: task.assignee,
                        username: 'Temporary Username',
                        email: 'temp@example.com',
                      }
                    : task.assignee
                  : {
                      _id: 'unknown',
                      username: 'Unknown User',
                      email: 'unknown@example.com',
                    },
              };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAGS.TASKS],
      // Optimistic update
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            draft.tasks = draft.tasks.filter((task) => task.id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
