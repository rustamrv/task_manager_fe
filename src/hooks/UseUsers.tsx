import { useGetAllUsersQuery } from '@api/endpoints/UserApi';

export const useUsers = () => {
  const { data: usersInit } = useGetAllUsersQuery();
  const users = usersInit || [];

  return { users };
};
