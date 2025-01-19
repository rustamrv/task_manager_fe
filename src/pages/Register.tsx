import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Label } from '@components/ui/Label';

import { useRegisterUserMutation } from '@api/endpoints/AuthApi';
import { setToken } from '@api/AuthReducer';
import { BackendError } from '../interfaces/Errors';
import { registerSchema } from '@utils/validates/RegisterLogin';
import { RegisterFormInputs } from '@utils/validates/types/RegisterLogin.type';

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const [serverError, setServerError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const onSubmit = async (data: RegisterFormInputs) => {
    setServerError(null);
    try {
      const response = await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
      }).unwrap();

      const token = response.token;

      if (token) {
        dispatch(setToken(token));
        navigate('/dashboard');
      } else {
        throw new Error('No token returned by the server.');
      }
    } catch (error_) {
      const error = error_ as BackendError;

      console.error('Registration error:', error);
      setServerError(
        error?.data?.message || 'Failed to register. Please try again.'
      );
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen lg:ml-72 px-4">
      <div className="w-full md:w-1/2 text-center mb-8 md:mb-0">
        <img
          src="/images/task-management.svg"
          alt="Task Management"
          className="w-3/4 max-w-xs md:max-w-sm lg:max-w-md mx-auto"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <form
          className="w-full max-w-sm mx-auto p-4 border rounded-lg shadow-md bg-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username')}
            onChange={() => clearErrors('username')}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}

          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            onChange={() => clearErrors('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            onChange={() => clearErrors('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <Label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mt-4"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            onChange={() => clearErrors('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}

          {serverError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4 text-center">
              {serverError}
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-2 px-4 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="w-full max-w-sm mx-auto mt-4">
          <Button
            type="button"
            className="w-full py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            onClick={() => navigate('/')}
          >
            Login
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Register;
