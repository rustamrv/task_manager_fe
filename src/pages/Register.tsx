import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { Label } from '@components/ui/Label';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        error?.data?.error || 'Failed to register. Please try again.'
      );
    }
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-center w-full min-h-screen px-4 lg:ml-32">
      <div className="w-full md:w-1/2 text-center mb-8 md:mb-0">
        <img
          src="/images/task-management.svg"
          alt="Task Management"
          className="w-3/4 max-w-xs md:max-w-sm lg:max-w-md mx-auto"
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <form
          className="w-full max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              {...register('username')}
              onChange={() => clearErrors('username')}
            />
            <p className="h-5 text-sm text-red-500 min-h-[20px]">
              {errors.username?.message}
            </p>
          </div>

          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              onChange={() => clearErrors('email')}
            />
            <p className="h-5 text-sm text-red-500 min-h-[20px]">
              {errors.email?.message}
            </p>
          </div>

          <div className="mb-4 relative">
            <Label className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password')}
                onChange={() => clearErrors('password')}
                className="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-blue-500 absolute inset-y-0 right-0 flex items-center px-3 hover:bg-blue-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
            <p className="h-5 text-sm text-red-500 min-h-[20px]">
              {errors.password?.message}
            </p>
          </div>

          <div className="mb-4 relative">
            <Label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                onChange={() => clearErrors('confirmPassword')}
                className="mt-1 block w-full p-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="bg-blue-500 absolute inset-y-0 right-0 flex items-center px-3 hover:bg-blue-600 transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
            <p className="h-5 text-sm text-red-500 min-h-[20px]">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <div className="min-h-[40px] flex items-center justify-center transition-all duration-300">
            {serverError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
                {serverError}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2 px-4 mt-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="w-full max-w-md mx-auto mt-4">
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
