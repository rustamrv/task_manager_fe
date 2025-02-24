import { createContext, useContext, useMemo } from 'react';
import {
  useGetAllTasksQuery,
  useLazyGetAllTasksQuery,
} from '@api/endpoints/TaskApi';
import { GetTask } from '@api/types/TaskTypes';

interface TaskContextType {
  tasks: GetTask;
  isLoading: boolean;
  error: unknown;
  searchTasks: (query: string) => Promise<void>;
  isFetching: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isLoading, error } = useGetAllTasksQuery();
  const [getTasks, { data: searchData, isFetching }] =
    useLazyGetAllTasksQuery();

  const tasks = useMemo(() => {
    return searchData ?? data ?? ({} as GetTask);
  }, [searchData, data]);

  const searchTasks = async (query: string) => {
    await getTasks(query.trim() === '' ? undefined : query);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, isLoading, error, searchTasks, isFetching }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};
