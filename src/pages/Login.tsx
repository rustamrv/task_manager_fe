import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useLoginUserMutation } from '../api/endpoints/AuthApi';
import { useDispatch } from 'react-redux';
import { setToken } from '../api/AuthReducer';
import { Label } from '@/components/ui/label';
import { BackendError } from '../interfaces/Types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const logo = '/images/task-management.svg';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading, isSuccess, isError }] = useLoginUserMutation();

  const onSubmit = async (data: LoginFormInputs) => {
    setServerError(null);
    try {
      const response = await loginUser({
        email: data.email,
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
      console.error('Login error:', error);
      setServerError(
        error?.data?.message || 'Failed to Login. Please try again.'
      );

      if (error?.data?.message === 'Invalid credentials') {
        setError('email', {
          type: 'manual',
          message: 'Invalid credentials',
        });
      }
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center overflow-x-hidden md:justify-between w-full h-screen px-4 py-8">
      <div className="w-full md:w-1/2 text-center px-4 mb-8 md:mb-0">
        <img
          src={logo}
          alt="Task Management"
          className="w-3/4 max-w-xs md:max-w-sm lg:max-w-md mx-auto md:mx-0 max-w-full"
        />
      </div>

      <div className="w-full md:w-1/2 px-4">
        <form
          className="flex flex-col gap-4 w-full max-w-md mx-auto md:mx-0"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {serverError && (
            <p className="text-red-600 text-center font-medium">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            className="w-full mt-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <h2 className="mt-4 text-center text-sm">OR</h2>
        <div className="flex flex-col gap-4 w-full max-w-md mx-auto md:mx-0">
          <Button
            type="button"
            className="w-full py-2 mt-4 bg-black text-white rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-gray-300 disabled:opacity-50"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Login;
