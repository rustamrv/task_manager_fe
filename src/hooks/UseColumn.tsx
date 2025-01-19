import { useEffect, useState } from 'react';
import { useGetAllTasksQuery } from '@api/endpoints/TaskApi';
import { GetTask, Task } from '@api/types/TaskTypes';

export const useColumns = () => {
  const { data, isLoading, isError, refetch } = useGetAllTasksQuery();
  const columns: GetTask = data || {};

  return { columns, isLoading, isError, refetch };
};
