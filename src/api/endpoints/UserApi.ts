import { TAGS } from '@api/constants/Tags';
import { apiSlice } from '../ApiSlice';
import { User, UpdateProfileResponse } from '../types/UserTypes';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<User[], void>({
      query: () => 'profile/users',
    }),
    getProfile: builder.query<User, void>({
      query: () => 'profile',
      providesTags: [TAGS.PROFILE],
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: 'profile/upload',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: [TAGS.PROFILE],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = usersApi;
