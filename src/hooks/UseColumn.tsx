import { useEffect, useState } from 'react';
import { useGetAllTasksQuery } from '../api/endpoints/TaskApi';

export const useColumns = () => {
  const {
    data: columnsInit,
    isLoading,
    isError,
    refetch,
  } = useGetAllTasksQuery();
  const [columns, setColumns] = useState(columnsInit || []);

  useEffect(() => {
    if (columnsInit) {
      setColumns(columnsInit);
    }
  }, [columnsInit]);

  return { columns, isLoading, isError, refetch };
};
