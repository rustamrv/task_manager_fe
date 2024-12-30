import { apiSlice } from '../ApiSlice';
import { User, UpdateProfileResponse } from '../types/UserTypes';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => 'profile/users',
    }),
    getProfile: builder.query<User, void>({
      query: () => 'profile',
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: 'profile/upload',
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = usersApi;
