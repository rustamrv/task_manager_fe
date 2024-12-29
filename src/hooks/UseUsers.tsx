import { useEffect, useState } from 'react';
import { useGetAllUsersQuery } from '../api/endpoints/UserApi';

export const useUsers = () => {
  const { data: usersInit } = useGetAllUsersQuery();
  const [users, setUsers] = useState(usersInit || []);

  useEffect(() => {
    if (usersInit) {
      setUsers(usersInit);
    }
  }, [usersInit]);

  return { users };
};
