import { useEffect, useState } from 'react';
import { useGetAllTasksQuery } from '@api/endpoints/TaskApi';
import { GetTask, Task } from '@api/types/TaskTypes';

export const useColumns = () => {
  const { data, isLoading, isError, refetch } = useGetAllTasksQuery();
  const [columns, setColumns] = useState<GetTask>(data || {});

  useEffect(() => {
    if (data) {
      setColumns(data);
    }
  }, [data]);

  return { columns: columns || [], isLoading, isError, refetch };
};
