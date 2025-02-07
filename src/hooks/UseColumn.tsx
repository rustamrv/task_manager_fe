import { useEffect, useState } from 'react';
import {
  useGetAllTasksQuery,
  useLazyGetAllTasksQuery,
} from '@api/endpoints/TaskApi';
import { GetTask, Task } from '@api/types/TaskTypes';

export const useColumns = () => {
  const { data, isLoading, isError, refetch } = useGetAllTasksQuery();
  const [getTasks, { data: searchData, isFetching }] =
    useLazyGetAllTasksQuery();
  const [columns, setColumns] = useState(data || ({} as GetTask));

  useEffect(() => {
    if (searchData) {
      setColumns(searchData);
    } else if (data) {
      setColumns(data);
    }
  }, [searchData, data]);

  const searchTasks = async (query: string) => {
    if (query.trim() === '') {
      await getTasks();
    } else {
      await getTasks(query);
    }
  };

  return { columns, isLoading, isError, refetch, searchTasks, isFetching };
};
