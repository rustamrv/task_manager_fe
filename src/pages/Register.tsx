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
import { BackendError } from '../interfaces/Interface';
import { registerSchema } from '@utils/validates/register-login';
import { RegisterFormInputs } from '@utils/validates/types/register-login.type';

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
    <section className="flex flex-col md:flex-row items-center justify-center overflow-x-hidden md:justify-between w-full min-h-screen lg:ml-72 px-4">
      <div className="w-full md:w-1/2 text-center mb-8 md:mb-0">
        <img
          src="/images/task-management.svg"
          alt="Task Management"
          className="w-3/4 max-w-xs md:max-w-sm lg:max-w-md mx-auto"
        />
      </div>

      <div className="w-full md:w-1/2">
        <form
          className="flex flex-col gap-y-3 w-full max-w-md mx-auto bg-white p-6 shadow-md rounded-lg"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label htmlFor="username" className="text-sm font-medium">
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username')}
          />
          <div className="h-6">
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          <div className="h-6">
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
          />
          <div className="h-6">
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register('confirmPassword')}
          />
          <div className="h-6">
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="h-6 text-center">
            {serverError && (
              <p className="text-red-500 font-medium">{serverError}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2 mt-4 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>
 
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            type="button"
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
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
