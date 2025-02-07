import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { useLoginUserMutation } from '@api/endpoints/AuthApi';
import { useDispatch } from 'react-redux';
import { setToken } from '@api/AuthReducer';
import { Label } from '@components/ui/Label';
import { BackendError } from '../interfaces/Errors';
import { loginSchema } from '@utils/validates/RegisterLogin';
import { LoginFormInputs } from '@utils/validates/types/RegisterLogin.type';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@components/ui/UseToast';

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
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

      toast({
        title: 'Error',
        description: error?.data?.error,
        variant: 'destructive',
      });
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
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white"
        >
          <div className="mb-4">
            <Label className="block text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              // reassigning 'onChange' below
              // onChange={() => clearErrorsOnChange('email')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="h-5 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div className="mb-4 relative">
            <Label className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                // reassigning 'onChange' below
                // onChange={() => clearErrorsOnChange('password')}
                placeholder="Enter your password"
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
            <p className="h-5 text-sm text-red-500">
              {errors.password?.message}
            </p>
          </div>

          <div className="h-4 min-h-[20px] mb-4 text-center">
            {errors.root && (
              <p className="text-red-500 font-medium">{errors.root.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="w-full max-w-md mx-auto">
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
