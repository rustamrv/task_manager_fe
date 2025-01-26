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
      transformResponse: (response: GetTask) => {
        return response;
      },
      transformErrorResponse: (error) => {
        return { 'to-do': [], 'in-progress': [], done: [] };
      },
    }),
    addTask: builder.mutation<Task, CreateTask>({
      query: (task: CreateTask) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: [TAGS.TASKS],
      onQueryStarted: async (task, { dispatch, queryFulfilled }) => {
        const tempId = `temp-${Date.now()}`;
        const tempTask = {
          ...task,
          id: tempId,
          position: 0,
          assignee: { _id: '', username: '', email: '' },
        };
      
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            if (!draft[task.status]) {
              draft[task.status] = [];
            }
            const alreadyExists = draft[task.status].some(
              (t) => t.title === task.title
            );
      
            if (!alreadyExists) {
              draft[task.status].push(tempTask);
            }
          })
        );
      
        try {
          const { data: newTask } = await queryFulfilled;
      
          dispatch(
            tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
              if (!draft[newTask.status]) {
                draft[newTask.status] = [];
              }
      
              draft[newTask.status] = draft[newTask.status].filter(
                (t) => t.id !== tempId
              );
      
              if (!draft[newTask.status].some((t) => t.id === newTask.id)) {
                draft[newTask.status].push(newTask);
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      }
      
    }),
    updateTask: builder.mutation<Task, { id: string; task: UpdateTask }>({
      query: ({ id, task }) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: [TAGS.TASKS],
      async onQueryStarted({ id, task }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            if (!task || !task.status || task.position === undefined) {
              console.error(
                'Error: task or task.status is undefined, skipping update.'
              );
              return;
            }

            let foundTask: Task | null = null;
            let currentStatus: string | null = null;

            const statuses = ['to-do', 'in-progress', 'done'];
            for (const status of statuses) {
              let taskList = draft[status] ? [...draft[status]] : [];

              const index = taskList.findIndex((t: Task) => t.id === id);
              if (index !== -1) {
                foundTask = { ...taskList[index] };
                currentStatus = status;
                break;
              }
            }

            if (!foundTask || !currentStatus) {
              return;
            }

            draft[currentStatus] = draft[currentStatus].filter(
              (t) => t.id !== id
            );

            if (!draft[task.status]) {
              draft[task.status] = [];
            }

            if (foundTask) {
              draft[task.status].splice(task.position, 0, {
                ...foundTask,
                ...task,
              } as Task);
            }

            draft[task.status].forEach((t, index) => {
              t.position = index;
            });
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
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getAllTasks', undefined, (draft) => {
            for (const status in draft) {
              draft[status] = draft[status].filter((task) => task.id !== id);
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
    getTaskStats: builder.query<TaskStatsResponse, void>({
      query: () => '/tasks/stats',
      providesTags: [TAGS.TASKS],
    }),
    getTaskCompletionStats: builder.query<TaskCompletionStatsResponse[], void>({
      query: () => '/tasks/completion-stats',
      providesTags: [TAGS.TASKS],
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
