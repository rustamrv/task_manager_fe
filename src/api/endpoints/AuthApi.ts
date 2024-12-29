import { apiSlice } from '../ApiSlice';
import { RegisterUserRequest, LoginUserRequest } from '../types/AuthTypes';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (newUser: RegisterUserRequest) => ({
        url: 'auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials: LoginUserRequest) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
